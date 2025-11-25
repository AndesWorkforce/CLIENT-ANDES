"use server";

import { createServerAxios } from "@/services/axios.server";

export async function getLatestNotifications(limit = 7) {
  try {
    const axios = await createServerAxios();
    const res = await axios.get(`/notifications`, { params: { limit } });
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error(
      "getLatestNotifications error",
      error?.response?.data || error
    );
    return { success: false, error: error?.response?.data || String(error) };
  }
}

export async function getUnreadNotificationsCount() {
  try {
    const axios = await createServerAxios();
    const res = await axios.get(`/notifications/unread-count`);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error(
      "getUnreadNotificationsCount error",
      error?.response?.data || error
    );
    return { success: false, error: error?.response?.data || String(error) };
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const axios = await createServerAxios();
    const res = await axios.patch(`/notifications/${id}/read`);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error(
      "markNotificationAsRead error",
      error?.response?.data || error
    );
    return { success: false, error: error?.response?.data || String(error) };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const axios = await createServerAxios();
    const res = await axios.patch(`/notifications/read-all`);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error(
      "markAllNotificationsAsRead error",
      error?.response?.data || error
    );
    return { success: false, error: error?.response?.data || String(error) };
  }
}
