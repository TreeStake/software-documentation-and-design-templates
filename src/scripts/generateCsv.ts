import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const ROWS_COUNT = 1000;
const DATA_DIR = path.resolve(__dirname, '../../data');
const FILE_PATH = path.join(DATA_DIR, 'seed_data.csv');

const escapeCsv = (text: string | number | boolean | Date) => `"${String(text).replace(/"/g, '""')}"`;

async function generateCsv() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const recruiters = Array.from({ length: 50 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        department: faker.helpers.arrayElement(['IT', 'Sales', 'HR', 'Marketing']),
        successfulHires: faker.number.int({ min: 0, max: 100 }),
        activeVacanciesCount: faker.number.int({ min: 1, max: 15 }),
        averageTimeToHire: faker.number.int({ min: 10, max: 60 })
    }));

    const vacancies = Array.from({ length: 100 }).map(() => ({
        id: faker.string.uuid(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        requiredSkills: faker.helpers.arrayElements(['React', 'Node.js', 'TypeScript', 'SQL', 'Python', 'AWS', 'Communication'], 3).join(', '),
        isActive: faker.datatype.boolean(0.8)
    }));

    const headers = [
        'CandidateId', 'CandidateName', 'CandidateEmail', 'ResumeUrl', 'CandidateSkills', 'CandidateStatus',

        'RecruiterId', 'RecruiterName', 'RecruiterEmail', 'Department', 'SuccessfulHires', 'ActiveVacanciesCount', 'AverageTimeToHire',

        'VacancyId', 'VacancyTitle', 'Description', 'RequiredSkills', 'IsActive',

        'InterviewId', 'ScheduledDate', 'InterviewType',

        'Score', 'Feedback', 'IsPassed'
    ];

    const rows: string[] = [headers.join(',')];

    for (let i = 0; i < ROWS_COUNT; i++) {
        const recruiter = faker.helpers.arrayElement(recruiters);
        const vacancy = faker.helpers.arrayElement(vacancies);

        const candidateId = faker.string.uuid();
        const candidateStatus = faker.helpers.arrayElement(['Applied', 'Interviewing', 'Offered', 'Rejected']);

        const isPassed = faker.datatype.boolean(0.4);
        const score = faker.number.int({ min: 10, max: 100 });

        const row = [
            candidateId, faker.person.fullName(), faker.internet.email(), faker.internet.url(),
                faker.helpers.arrayElements(['Java', 'CSS', 'HTML', 'Docker', 'Agile'], 2).join(', '), candidateStatus,

            recruiter.id, recruiter.name, recruiter.email, recruiter.department, recruiter.successfulHires,
                recruiter.activeVacanciesCount, recruiter.averageTimeToHire,

            vacancy.id, vacancy.title, vacancy.description, vacancy.requiredSkills, vacancy.isActive,

            faker.string.uuid(), faker.date.recent({ days: 30 }).toISOString(),
                faker.helpers.arrayElement(['Technical', 'HR', 'Manager', 'Final']),

            score, faker.lorem.sentence(), isPassed
        ];

        rows.push(row.map(escapeCsv).join(','));
    }

    fs.writeFileSync(FILE_PATH, rows.join('\n'), 'utf-8');
    console.log(`Successful: ${FILE_PATH}`);
}

generateCsv().catch(console.error);