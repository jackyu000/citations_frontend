import { NextResponse } from 'next/server';

const AI21_API_KEY = process.env.AI21_API_KEY;
const AI21_API_URL = 'https://api.ai21.com/studio/v1/maestro/runs';

// Function to create a new run
async function createRun(hypothesis: string) {
  const response = await fetch(AI21_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI21_API_KEY}`
    },
    body: JSON.stringify({
      input: [
        {
          role: "user",
          content: `My hypothesis is "${hypothesis}". What research exists on this? Generate 3 novel and professional hypotheses from the given text with experiments to test the hypothesis. Give me very relevant research papers I can read about it with their links.`,
        }
      ],
      // requirements:[
      //     {
      //         "name": "json",
      //         "description": "Generate JSON output"
      //     }
      // ],
      tools:[{"type": "file_search"}],
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create run');
  }

  return await response.json();
}

// Function to check run status
async function checkRunStatus(runId: string) {
  const response = await fetch(`${AI21_API_URL}/${runId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AI21_API_KEY}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to check run status');
  }

  return await response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hypothesis, runId } = body;

    // If runId is provided, check status of existing run
    if (runId) {
      const statusData = await checkRunStatus(runId);
      return NextResponse.json({ result: statusData });
    }
    
    // Otherwise create a new run
    const runData = await createRun(hypothesis);
    console.log("Created new run:", runData);
    
    return NextResponse.json({ result: runData });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process hypothesis' },
      { status: 500 }
    );
  }
}
