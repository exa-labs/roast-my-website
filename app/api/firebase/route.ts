import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const websiteUrl = searchParams.get('websiteUrl')?.toLowerCase();

  if (!websiteUrl) {
    return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
  }

  try {
    console.log('Fetching from Firebase for website:', websiteUrl);
    const websiteRoastsRef = collection(db, 'website_roasts');
    const q = query(websiteRoastsRef, where('websiteUrl', '==', websiteUrl));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log('Found cached data in Firebase');
      return NextResponse.json(doc.data());
    } else {
      console.log('No cached data found in Firebase');
      return NextResponse.json({ error: 'Website roast not found' });
    }
  } catch (error) {
    console.error('Firebase GET error:', error);
    return NextResponse.json({ error: 'Error fetching website roast', details: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { websiteUrl, websiteData, linkedinData, llmAnalysis } = await request.json();
    console.log('Attempting to save to Firebase:', { websiteUrl });

    if (!websiteUrl || !websiteData || !llmAnalysis) {
      console.error('Missing required data:', { 
        websiteUrl: !!websiteUrl, 
        websiteData: !!websiteData, 
        llmAnalysis: !!llmAnalysis 
      });
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const data = {
      websiteUrl: websiteUrl.toLowerCase(),
      websiteData,
      linkedinData,
      llmAnalysis,
      timestamp: new Date().toISOString()
    };

    console.log('Saving data to Firebase:', { websiteUrl: data.websiteUrl });
    const docRef = doc(db, 'website_roasts', data.websiteUrl);
    await setDoc(docRef, data, { merge: true });
    console.log('Successfully saved to Firebase with ID:', data.websiteUrl);
    
    return NextResponse.json({ message: 'Website roast saved successfully', id: data.websiteUrl });
  } catch (error) {
    console.error('Firebase POST error:', error);
    return NextResponse.json({ error: 'Error saving website roast', details: error }, { status: 500 });
  }
}
