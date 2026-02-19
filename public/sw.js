// Service Worker — push notifications only (no offline cache)
// This file intentionally has no install/activate/fetch cache logic.

self.addEventListener("push", function (event) {
  if (!event.data) return;

  var payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  var title = payload.title || "New notification";
  var options = {
    body: payload.body || "",
    icon: "/images/site/shared/logo.png",
    badge: "/images/site/shared/logo.png",
    data: { url: payload.url || "/dashboard" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  var targetUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "/dashboard";

  // Normalize /dashboard/requests/<uuid> → /dashboard/requests
  // until Phase 6 adds a dedicated detail route
  if (/^\/dashboard\/requests\/[0-9a-f-]+$/i.test(targetUrl)) {
    targetUrl = "/dashboard/requests";
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.indexOf(self.location.origin) !== -1 && "focus" in client) {
            return client.focus().then(function (focused) {
              if ("navigate" in focused) {
                return focused.navigate(targetUrl);
              }
            });
          }
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});
