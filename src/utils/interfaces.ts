import { documentationData } from "./types";

export interface repoData {
    repoName: string;
    repoUrl: string;
    repoOwner: string;
    numberOfContributors: number;
    numberOfOpenIssues: number;
    numberOfClosedIssues: number;
    lastCommitDate: string;
    licenses: string[];
    numberOfCommits: number;
    numberOfLines: number;
    documentation: documentationData;
}

export interface gitData {
    repoName: string;
    repoUrl: string;
    repoOwner: string;
    numberOfContributors: number;
    numberOfOpenIssues: number;
    numberOfClosedIssues: number;
    licenses: string[];
    numberOfCommits: number;
    numberOfLines: number;
}

export interface npmData {
    repoUrl: string;
    lastCommitDate: string;
    documentation: documentationData;
}

export interface envVars {
    logLevel: number;
    logPath: string;
}

export interface metricData1{
    URL: string;
    Correctness: number;
    Correctness_Latency: number;
    BusFactor: number;
    BusFactor_Latency: number;
    RampUp: number;
    RampUp_Latency: number;
    ResponsiveMaintainer: number;
    ResponsiveMaintainer_Latency: number;
    License: number;
    License_Latency: number;
    NetScore: number;
    NetScore_Latency: number;
    metricData ?: metricData2[];
}

export interface metricData2 {
    name: string;
    value: number; 
}