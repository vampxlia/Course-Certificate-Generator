import config from './certificateConfigs.json';

// Exporting the variable with an explicit type for safety
export const MAX_REPOSITORY_SIZE_BYTES: number = config.maxRepositorySizeBytes;
export const REPOSITORY_MAX_USE_PERCENTAGE: number = config.repositoryUsePercentageLimit;