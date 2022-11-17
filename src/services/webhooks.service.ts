export const webhooksNotificationsService = async (data: any) => {
  try {
    console.log(data)
    return data
  } catch (error: any) {
    console.error(error)
    return {
      error: error.message,
      status: 500
    }
  }
}
