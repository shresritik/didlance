import jobDetailsDB from "@/lib/db/job-details";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const suiAddress = searchParams.get("suiAddress");

    // If suiAddress is provided, handle it as a specific case
    if (suiAddress) {
      const results = await jobDetailsDB.getJobUsingAddress(suiAddress);
      return NextResponse.json(results);
    }
    // Otherwise, handle the regular search case
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const searchConditions: any = {};
    if (category && category !== "all") {
      searchConditions.category = category;
    }
    if (search) {
      searchConditions.search = search;
    }

    const results = await jobDetailsDB.searchJobs(
      searchConditions,
      page,
      limit
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    const newJob = await jobDetailsDB.createJob(jobData);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
