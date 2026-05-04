export interface AferoErrorResponse {
    /** UNIX timestamp of the request */
    timestamp: number;
    /** Request response code */
    status: number;
    /** Description of the error */
    error_description: string;
    /** URL of the request */
    path: string;
}
/**
 * Checks whether error is caused by Afero response
 * @param error Error object to check
 * @returns True if error is from Afero
 */
export declare function isAferoError(error: any): error is AferoErrorResponse;
//# sourceMappingURL=afero-error-response.d.ts.map