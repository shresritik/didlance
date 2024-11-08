import { Pool } from '@neondatabase/serverless';
import { z } from 'zod'; // Note: You'll need to install zod separately

// Zod schema for validation
const VerificationStatusSchema = z.object({
  payment: z.boolean(),
  phone: z.boolean(),
  email: z.boolean(),
});

const ClientHistorySchema = z.object({
  jobsPosted: z.number(),
  hireRate: z.number(),
  totalSpent: z.string(),
  memberSince: z.string(),
  verificationStatus: VerificationStatusSchema,
});
const JobStatus = z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
const JobDetailsSchema = z.object({
  id: z.string(),
  sui_address: z.string(),
  title: z.string(),
  description: z.string(),
  long_description: z.string(),
  budget: z.string(),
  time_posted: z.string(),
  category: z.string(),
  expertise: z.string(),
  proposals: z.array(z.string()).optional(),
  client_rating: z.coerce.number(),
  client_location: z.string(),
  job_type: z.string(),
  project_length: z.string(),
  weekly_hours: z.string().nullable(),
  skills: z.array(z.string()),
  activity_on: z.string(),
  job_status: JobStatus,
  client_history: ClientHistorySchema,
  attachments: z.array(z.string()).optional(),
  questions: z.array(z.string()).optional(),
});

type JobDetails = z.infer<typeof JobDetailsSchema>;

class JobDetailsDB {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  // Initialize database table
  async initializeTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS job_details (
        id TEXT PRIMARY KEY,
        sui_address TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT NOT NULL,
        budget TEXT NOT NULL,
        time_posted TEXT NOT NULL,
        category TEXT NOT NULL,
        expertise TEXT NOT NULL,
        proposals TEXT[],
        client_rating NUMERIC NOT NULL,
        client_location TEXT NOT NULL,
        job_type TEXT NOT NULL,
        project_length TEXT NOT NULL,
        weekly_hours TEXT,
        skills TEXT[] NOT NULL,
        activity_on TEXT NOT NULL,
        client_history JSONB NOT NULL,
        attachments TEXT[],
        questions TEXT[]
      )
    `;

    await this.pool.query(createTableQuery);
  }

  // Create a new job
  async createJob(jobDetails: JobDetails): Promise<JobDetails> {
    try {
      // Validate input data
      const validatedData = JobDetailsSchema.parse(jobDetails);

      const query = `
        INSERT INTO job_details (
          id, sui_address, title, description, long_description, budget, 
          time_posted, category, expertise, proposals, 
          client_rating, client_location, job_type, 
          project_length, weekly_hours, skills, activity_on, job_status,
          client_history, attachments, questions
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *
      `;

      const values = [
        validatedData.id,
        validatedData.sui_address,
        validatedData.title,
        validatedData.description,
        validatedData.long_description,
        validatedData.budget,
        validatedData.time_posted,
        validatedData.category,
        validatedData.expertise,
        validatedData.proposals,
        validatedData.client_rating,
        validatedData.client_location,
        validatedData.job_type,
        validatedData.project_length,
        validatedData.weekly_hours,
        validatedData.skills,
        validatedData.activity_on,
        validatedData.job_status,
        JSON.stringify(validatedData.client_history),
        validatedData.attachments,
        validatedData.questions,
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  // Get a job by ID
  async getJob(id: string): Promise<JobDetails | null> {
    const query = 'SELECT * FROM job_details WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const job = result.rows[0];
    return ({
      ...job,
      clientHistory: job.client_history,
    });
  }

  async getJobUsingAddress(id: string): Promise<JobDetails[] | null> {
    const query = 'SELECT * FROM job_details WHERE sui_address = $1';
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  }

  // Update a job
  async updateJob(id: string, jobDetails: Partial<JobDetails>): Promise<JobDetails | null> {
    try {
      const currentJob = await this.getJob(id);
      if (!currentJob) {
        return null;
      }

      const updatedJob = { ...currentJob, ...jobDetails };

      console.log(updatedJob);
      const validatedData = JobDetailsSchema.parse(updatedJob);

      const query = `
        UPDATE job_details 
        SET 
          title = $1,
          description = $2,
          long_description = $3,
          budget = $4,
          time_posted = $5,
          category = $6,
          expertise = $7,
          proposals = $8,
          client_rating = $9,
          client_location = $10,
          job_type = $11,
          project_length = $12,
          weekly_hours = $13,
          skills = $14,
          job_status = $15,
          activity_on = $16,
          client_history = $17,
          attachments = $18,
          questions = $19
        WHERE id = $20
        RETURNING *
      `;

      const values = [
        validatedData.title,
        validatedData.description,
        validatedData.long_description,
        validatedData.budget,
        validatedData.time_posted,
        validatedData.category,
        validatedData.expertise,
        validatedData.proposals,
        validatedData.client_rating,
        validatedData.client_location,
        validatedData.job_type,        // Changed from jobType
        validatedData.project_length,
        validatedData.weekly_hours,    // Changed from weeklyHours
        validatedData.skills,
        validatedData.job_status,      // Moved to correct position
        validatedData.activity_on,     // Changed from activityOn
        validatedData.client_history,  // Removed JSON.stringify()
        validatedData.attachments,
        validatedData.questions,
        id
      ];

      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  // Delete a job
  async deleteJob(id: string): Promise<boolean> {
    const query = 'DELETE FROM job_details WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0;
  }



  async searchJobs(
    searchParams: {
      category?: string;
      search?: string;
      expertise?: string;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<{ jobs: JobDetails[]; total: number }> {
    let conditions: string[] = ['1=1'];
    const values: any[] = [];
    let valueIndex = 1;

    if (searchParams.category) {
      conditions.push(`category = $${valueIndex}`);
      values.push(searchParams.category);
      valueIndex++;
    }

    if (searchParams.search) {
      conditions.push(`(
      title ILIKE $${valueIndex} OR 
      description ILIKE $${valueIndex} OR 
      long_description ILIKE $${valueIndex}
    )`);
      values.push(`%${searchParams.search}%`);
      valueIndex++;
    }

    if (searchParams.expertise) {
      conditions.push(`expertise = $${valueIndex}`);
      values.push(searchParams.expertise);
      valueIndex++;
    }

    const query = `
    SELECT *, COUNT(*) OVER() as total_count
    FROM job_details
    WHERE ${conditions.join(' AND ')}
    ORDER BY time_posted DESC
    LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
  `;

    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await this.pool.query(query, values);
    const total = result.rows[0]?.total_count || 0;

    const jobs = result.rows.map(row => ({
      ...row,
      clientHistory: row.client_history,
    }));

    return {
      jobs: jobs,
      total: Number(total),
    };
  }
}
const jobDetailsDB = new JobDetailsDB(process.env.NEON_DATABASE_URL!);

export default jobDetailsDB;
