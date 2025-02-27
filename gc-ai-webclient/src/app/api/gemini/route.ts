import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

const PROJECT_ID = "prizmpoc";
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-1.5-pro-002";
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const privateKey_id = process.env.REACT_APP_PRIVATE_KEY_ID;
const client_id = process.env.REACT_APP_CLIENT_ID;
const client_email = process.env.REACT_APP_CLIENT_EMAIL;

const credentials = {
  "type": "service_account",
  "project_id": "prizmpoc",
  "private_key_id": privateKey_id,
  "private_key": privateKey,
  "client_email": client_email,
  "client_id": client_id,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/svcacct1%40prizmpoc.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    console.log('Received question:', question);
    
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const tokenResponse = await client.authorize();
    const token = tokenResponse.access_token;
    console.log('Token obtained successfully');

    const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_NAME}:generateContent`;
    
    // Updated request body format with role
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: question }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));

    let responseText = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      responseText = 'No response generated';
      console.log('Response structure did not match expected format:', data);
    }

    return NextResponse.json({ text: responseText });

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}