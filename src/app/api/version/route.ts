import { NextResponse } from 'next/server';
import packageJson from '../../../../package.json';
import versionHistory from '../../../../version-history.json';

export async function GET() {
  try {
    const latestVersion = versionHistory.versions[0];

    return NextResponse.json({
      success: true,
      data: {
        currentVersion: packageJson.version,
        latestUpdate: latestVersion
      }
    });
  } catch (error) {
    console.error('Error fetching version info:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch version info' },
      { status: 500 }
    );
  }
}
