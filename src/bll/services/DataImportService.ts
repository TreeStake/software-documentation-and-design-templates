import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../tokens';
import { IDataImportService } from '../interfaces/IDataImportService';
import type { ICsvReader } from '../../dal/interfaces/ICsvReader';

import { Candidate } from '../../dal/entities/Candidate';
import { Recruiter } from '../../dal/entities/Recruiter';
import { Vacancy } from '../../dal/entities/Vacancy';
import { Interview } from '../../dal/entities/Interview';
import { InterviewResult } from '../../dal/entities/InterviewResult';
import type { IRecruiterRepository } from '../../dal/interfaces/IRecruiterRepository';
import type { IVacancyRepository } from '../../dal/interfaces/IVacancyRepository';
import type { ICandidateRepository } from '../../dal/interfaces/ICandidateRepository';
import type { IInterviewRepository } from '../../dal/interfaces/IInterviewRepository';

@injectable()
export class DataImportService implements IDataImportService {
    constructor(
        @inject(TOKENS.ICsvReader) private readonly csvReader: ICsvReader,
        @inject(TOKENS.IRecruiterRepository) private readonly recruiterRepo: IRecruiterRepository,
        @inject(TOKENS.IVacancyRepository) private readonly vacancyRepo: IVacancyRepository,
        @inject(TOKENS.ICandidateRepository) private readonly candidateRepo: ICandidateRepository,
        @inject(TOKENS.IInterviewRepository) private readonly interviewRepo: IInterviewRepository
    ) {}

    async importFromCsv(csvFilePath: string): Promise<number> {
        const rows = await this.csvReader.readFile(csvFilePath);

        const recruitersMap = new Map<string, Recruiter>();
        const vacanciesMap = new Map<string, Vacancy>();
        const candidatesMap = new Map<string, Candidate>();
        const interviews: Interview[] = [];

        for (const row of rows) {
            if (!recruitersMap.has(row.RecruiterId)) {
                const recruiter = new Recruiter();
                recruiter.id = row.RecruiterId;
                recruiter.name = row.RecruiterName;
                recruiter.email = row.RecruiterEmail;
                recruiter.department = row.Department;
                recruiter.successfulHires = Number(row.SuccessfulHires);
                recruiter.activeVacanciesCount = Number(row.ActiveVacanciesCount);
                recruiter.averageTimeToHire = Number(row.AverageTimeToHire);
                recruitersMap.set(recruiter.id, recruiter);
            }

            if (!vacanciesMap.has(row.VacancyId)) {
                const vacancy = new Vacancy();
                vacancy.id = row.VacancyId;
                vacancy.title = row.VacancyTitle;
                vacancy.description = row.Description;
                vacancy.requiredSkills = row.RequiredSkills;
                vacancy.isActive = row.IsActive === 'true';
                vacancy.recruiter = recruitersMap.get(row.RecruiterId)!;
                vacanciesMap.set(vacancy.id, vacancy);
            }

            if (!candidatesMap.has(row.CandidateId)) {
                const candidate = new Candidate();
                candidate.id = row.CandidateId;
                candidate.name = row.CandidateName;
                candidate.email = row.CandidateEmail;
                candidate.resumeUrl = row.ResumeUrl;
                candidate.skills = row.CandidateSkills;
                candidate.status = row.CandidateStatus;
                candidate.vacancy = vacanciesMap.get(row.VacancyId)!;
                candidatesMap.set(candidate.id, candidate);
            }

            const interview = new Interview();
            interview.id = row.InterviewId;
            interview.scheduledDate = new Date(row.ScheduledDate);
            interview.type = row.InterviewType;
            
            interview.candidate = candidatesMap.get(row.CandidateId)!;
            interview.recruiter = recruitersMap.get(row.RecruiterId)!;

            const result = new InterviewResult();
            result.score = Number(row.Score);
            result.feedback = row.Feedback;
            result.isPassed = row.IsPassed === 'true';
            interview.result = result;
            interviews.push(interview);
        }

        await this.recruiterRepo.saveMany(Array.from(recruitersMap.values()));

        await this.vacancyRepo.saveMany(Array.from(vacanciesMap.values()));

        await this.candidateRepo.saveMany(Array.from(candidatesMap.values()));

        const BATCH_SIZE = 100;
        let savedInterviewsCount = 0;
        for (let i = 0; i < interviews.length; i += BATCH_SIZE) {
            const batch = interviews.slice(i, i + BATCH_SIZE);
            await this.interviewRepo.saveMany(batch);
            savedInterviewsCount += batch.length;
        }

        console.log('Successful migration!');
        return savedInterviewsCount;
    }
}