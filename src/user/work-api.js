import { supabase } from "../api/supabase.js";

export async function fetchTourProgress(tourId, userCode) {
    let totalTourLines = 0;
    let evaluatedLinesCount = 0;

    const { data: tourData, error: tourErr } = await supabase
        .from('tests')
        .select('due_date')
        .eq('id', localStorage.getItem('CURRENT_TEST_ID'))
        .maybeSingle();

    const dueDate = tourData?.due_date || null;

    const { data: tourImages, error: imgError } = await supabase
        .from('images')
        .select('id, image_url, image_title')
        .eq('tour_id', tourId)
        .order('id', { ascending: true });

    if (imgError || !tourImages || tourImages.length === 0) {
        throw new Error("Failed to load tour images");
    }

    const imageIds = tourImages.map(img => img.id);

    const { count: totalLines, error: countErr } = await supabase
        .from('image_contents')
        .select('*', { count: 'exact', head: true })
        .in('image_id', imageIds);

    if (!countErr) totalTourLines = totalLines || 0;

    const { count: evalCount, error: evalErr } = await supabase
        .from('line_evaluations')
        .select('*', { count: 'exact', head: true })
        .eq('user_code', userCode)
        .in('image_id', imageIds);

    if (!evalErr) evaluatedLinesCount = evalCount || 0;

    return { tourImages, totalTourLines, evaluatedLinesCount, dueDate };
}

export async function fetchImageLines(imageId, assignedLang) {
    const langCol = assignedLang || 'espanol';
    let selectCols = `line_id`;
    if (langCol !== 'korean') selectCols += `, ${langCol}`;
    else selectCols += `, korean`;

    const { data: lines, error: lineError } = await supabase
        .from('image_contents')
        .select(selectCols)
        .eq('image_id', imageId)
        .order('line_id', { ascending: true });

    if (lineError || !lines) {
        throw new Error("Failed to load lines");
    }
    return lines;
}

export async function fetchUserEvaluationsForImage(userCode, imageId) {
    const { data: evals } = await supabase
        .from('line_evaluations')
        .select('line_id')
        .eq('user_code', userCode)
        .eq('image_id', imageId)
        .order('line_id', { ascending: false });
    return evals || [];
}

export async function saveLineEvaluation(payload) {
    const { userCode, imageId, lineId, testId, result, detail } = payload;

    function withTimeout(promise, ms = 5000) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
        ]);
    }

    const savePromise = supabase.from('line_evaluations').upsert({
        user_code: userCode,
        image_id: imageId,
        line_id: lineId,
        test_id: testId,
        result: result,
        detail: detail,
        timestamp: new Date().toISOString()
    }, { onConflict: 'user_code,image_id,line_id' });

    const { error } = await withTimeout(savePromise);
    if (error) {
        throw new Error(error.message || JSON.stringify(error));
    }
    return true;
}

export async function markTestCompleted(testId) {
    if (!testId) return;
    await supabase.from('tests').update({ completed_at: new Date().toISOString() }).eq('id', testId);
}

export async function fetchRecentEvaluatedImageId(userCode, imageIds) {
    const { data: recentEvals, error } = await supabase
        .from('line_evaluations')
        .select('image_id')
        .eq('user_code', userCode)
        .in('image_id', imageIds)
        .order('timestamp', { ascending: false })
        .limit(1);

    if (!error && recentEvals && recentEvals.length > 0) {
        return recentEvals[0].image_id;
    }
    return null;
}

export async function saveImageProgress(userCode, testId, imageId) {
    if (!userCode || !testId || !imageId) {
        console.error("❌ saveImageProgress missing params:", { userCode, testId, imageId });
        return;
    }

    console.log(`⏳ Saving progress: User=${userCode}, Test=${testId}, Image=${imageId}`);

    const { error } = await supabase.from('user_progress').upsert({
        user_code: userCode,
        test_id: testId,
        image_id: imageId,
        is_completed: true,
        completed_at: new Date().toISOString()
    }, { onConflict: 'user_code,test_id,image_id' });

    if (error) {
        console.error("❌ Supabase Error (user_progress):", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
    } else {
        console.log("✅ user_progress updated successfully!");
    }
}

export async function fetchCompletedImageIds(userCode, testId) {
    if (!userCode || !testId) return [];

    const { data, error } = await supabase
        .from('user_progress')
        .select('image_id')
        .eq('user_code', userCode)
        .eq('test_id', testId)
        .eq('is_completed', true);

    if (error) {
        console.error("❌ Error fetching completed images:", error);
        return [];
    }
    return (data || []).map(row => row.image_id);
}
