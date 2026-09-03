export enum HealthService {
    APP = 'app',
    POSTGRES = 'postgres',
    REDIS = 'redis',
    S3 = 's3'
}

export enum HealthServiceStatus {
    ok = 'ok',
    error = 'error'
}

export interface HealthServiceStatusDto {
    status: HealthServiceStatus
    service: HealthService
}
