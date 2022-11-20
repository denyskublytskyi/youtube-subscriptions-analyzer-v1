class ApiError extends Error {
  name = "ApiError";
  constructor({ message, status, code, meta }) {
    super(message);

    this.status = status;
    this.code = code;
    this.meta = meta;
  }
}

export const getYoutubeSubscriptions = async ({ idToken }) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/getYoutubeSubscriptions`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (e) {
    console.error("Fetch youtube subscriptions error =>", e);
    return [];
  }
};

export const deleteYoutubeSubscriptionsByIds = async (
  { subscriptionIds },
  { idToken }
) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/deleteYoutubeSubscriptions`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscriptionIds }),
      method: "DELETE",
    }
  );

  if (!response.ok) {
    let message;
    let code;
    let meta;
    let status;
    try {
      const data = await response.json();
      ({ code, meta, status } = data);
      message =
        data?.errors?.map(({ message }) => message)?.join(", ") ??
        data?.message ??
        data;
    } catch (e) {
      message = await response.text();
    }
    throw new ApiError({ message, status, code, meta });
  }
};
