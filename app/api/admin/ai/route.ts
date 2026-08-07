import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Using environment variables
    const COZE_API_KEY = process.env.AIRTABLE_API_KEY; // We can reuse the same one
    const COZE_BOT_ID = '7670842943922339845';

    const COZE_API_URL = 'https://api.coze.com/v3/chat';

    const requestBody = {
      bot_id: COZE_BOT_ID,
      user_id: 'admin_user',
      stream: false,
      auto_save_history: true,
      additional_messages: [
        {
          role: 'user',
          content: message,
          content_type: 'text',
        },
      ],
    };

    const response = await axios.post(COZE_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${COZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const aiReply = response.data.messages?.[0]?.content || "I couldn't process that request.";

    return NextResponse.json({ 
      success: true, 
      reply: aiReply 
    });

  } catch (error: any) {
    console.error('❌ Coze API Error:', error?.response?.data || error.message);
    return NextResponse.json(
      { success: false, error: 'AI connection failed.' }, 
      { status: 500 }
    );
  }
}