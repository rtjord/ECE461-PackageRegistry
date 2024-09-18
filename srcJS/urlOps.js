"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlAnalysis = void 0;
const https = __importStar(require("https"));
class urlAnalysis {
    evalUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const npmPattern = /^https:\/\/www\.npmjs\.com\/package\/[\w-]+$/;
            const gitPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
            if (gitPattern.test(url)) {
                const cleanedUrl = url.replace(/\.git$/, '');
                return [0, cleanedUrl];
            }
            else if (npmPattern.test(url)) {
                try {
                    let repoUrl = yield this.getRepositoryUrl(url);
                    return [0, repoUrl || '']; // Ensure we return an empty string if repoUrl is null
                }
                catch (error) {
                    console.error('Error fetching repository URL:', error);
                    return [-1, '']; // Return error code and empty string on failure
                }
            }
            else {
                return [-1, ''];
            }
        });
    }
    extractPackageName(url) {
        const npmPattern = /^https:\/\/www\.npmjs\.com\/package\/[\w-]+$/;
        if (npmPattern.test(url)) {
            const parts = url.split('/');
            return parts[parts.length - 1]; // Get the last part of the URL
        }
        else {
            console.error('Invalid npm package URL');
            return null;
        }
    }
    getRepositoryUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageName = this.extractPackageName(url);
            if (!packageName) {
                return null; // Return null if package name extraction fails
            }
            const registryUrl = 'https://registry.npmjs.org/' + packageName;
            console.log(registryUrl);
            return new Promise((resolve, reject) => {
                https.get(registryUrl, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const packageData = JSON.parse(data);
                            // Check if repository field exists and return the URL
                            if (packageData.repository && packageData.repository.url) {
                                let repoUrl = packageData.repository.url;
                                // Remove 'git+' and '.git' scheme if present
                                repoUrl = repoUrl.replace(/^git\+/, '');
                                repoUrl = repoUrl.replace(/\.git$/, '');
                                // Convert SSH URLs to HTTPS
                                repoUrl = repoUrl.replace(/^ssh:\/\/git@github\.com/, 'https://github.com');
                                resolve(repoUrl);
                            }
                            else {
                                resolve(null); // No repository URL found
                            }
                        }
                        catch (err) {
                            reject('Error parsing npm registry data: ' + err);
                        }
                    });
                }).on('error', (err) => {
                    reject('Error fetching data from npm registry: ' + err);
                });
            });
        });
    }
}
exports.urlAnalysis = urlAnalysis;