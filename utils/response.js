export const successResponse = async (res, message, success, data) => {
    return res.status(200).json({
        message: message,
        success: success,
        data: data
    })
}

export const failedResponse = async (res, message, success) => {
    return res.status(400).json({
        message: message,
        success: success
    })
}