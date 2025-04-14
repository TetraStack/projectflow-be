export class ApiResponse {
    statusCode: number
    message: string
    data: Object
    success: boolean

    constructor(statusCode: number = 200, message: string = "Success", data: Object) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400
    }
}