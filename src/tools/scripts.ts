import { urlAnalysis } from './urlOps';
import { repoData } from '../utils/interfaces';
import { gitAnalysis, npmAnalysis } from './api';
import { envVars } from './getEnvVars';
import { logger } from './logging';

export class runAnalysis {
    private npmAnalysis: npmAnalysis;
    private gitAnalysis: gitAnalysis;
    private urlAnalysis: urlAnalysis;
    private token: string;
    private logger: logger;

    constructor(envVars: envVars) {
        this.token = envVars.token;
        this.logger = new logger(envVars);
        this.npmAnalysis = new npmAnalysis(envVars);
        this.gitAnalysis = new gitAnalysis(envVars);
        this.urlAnalysis = new urlAnalysis();
    }

    async runAnalysis(urls: string[]): Promise<repoData[]> {
        if (!this.gitAnalysis.isTokenValid()) {
            this.logger.logInfo('No valid token provided');
            process.exit(1);
        }
        
        const repoDataPromises = urls.map((url, index) => this.evaluateMods(url, index));
        const repoDataArr = await Promise.all(repoDataPromises);
        return repoDataArr;
    }

    async evaluateMods(url: string, index: number): Promise<repoData> {
        const [type, cleanedUrl] = await this.urlAnalysis.evalUrl(url);
        let repoData: repoData = {
            repoName: '',
            repoUrl: url,
            repoOwner: '',
            numberOfContributors: -1,
            numberOfOpenIssues: -1,
            numberOfClosedIssues: -1,
            lastCommitDate: '',
            licenses: [],
            numberOfCommits: -1,
            numberOfLines: -1,
            documentation: {
                hasReadme: false,
                numLines: -1,
                hasToc: false,
                hasInstallation: false,
                hasUsage: false,
                hasExamples: false,
                hasDocumentation: false
            }
        };
        if (type === -1 || cleanedUrl === '') {
            this.logger.logDebug(`Invalid URL - ${url}`);
            return repoData;
        }

        const [npmData, gitData] = await Promise.all([
            await this.npmAnalysis.runTasks(cleanedUrl, index),
            await this.gitAnalysis.runTasks(cleanedUrl)
        ]);


        repoData = {
            repoName: gitData.repoName,
            repoUrl: cleanedUrl,
            repoOwner: gitData.repoOwner,
            numberOfContributors: gitData.numberOfContributors,
            numberOfOpenIssues: gitData.numberOfOpenIssues,
            numberOfClosedIssues: gitData.numberOfClosedIssues,
            lastCommitDate: npmData.lastCommitDate,
            licenses: gitData.licenses,
            numberOfCommits: gitData.numberOfCommits,
            numberOfLines: gitData.numberOfLines,
            documentation: {
                hasReadme: npmData.documentation.hasReadme,
                numLines: npmData.documentation.numLines,
                hasToc: npmData.documentation.hasToc,
                hasInstallation: npmData.documentation.hasInstallation,
                hasUsage: npmData.documentation.hasUsage,
                hasExamples: npmData.documentation.hasExamples,
                hasDocumentation: npmData.documentation.hasDocumentation
            }
        };

        return repoData;
    }
}
