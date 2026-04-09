import api from "./axios";

// toggle subscribe / unsubscribe
export const toggleSubscription = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`);

// get subscribers of a channel
export const getChannelSubscribers = (channelId) =>
  api.get(`/subscriptions/c/${channelId}`);

// get channels user subscribed to
export const getSubscribedChannels = (userId) =>
  api.get(`/subscriptions/u/${userId}`);
