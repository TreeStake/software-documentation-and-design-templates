export const TOKENS = {
    IDataImportService: Symbol.for("IDataImportService"),
    ICsvReader: Symbol.for("ICsvReader"),

    ICandidateRepository: Symbol.for("ICandidateRepository"),
    IRecruiterRepository: Symbol.for("IRecruiterRepository"),
    IVacancyRepository: Symbol.for("IVacancyRepository"),
    IInterviewRepository: Symbol.for("IInterviewRepository"),

    VacancyController: Symbol.for("VacancyController"),
    CandidateController: Symbol.for("CandidateController"),
    RecruiterController: Symbol.for("RecruiterController"),
    InterviewController: Symbol.for("InterviewController"),

    IInterviewResultRepository: Symbol.for("IInterviewResultRepository"),
    InterviewResultController: Symbol.for("InterviewResultController")
};