// Material Symbols names (Google Fonts) — same set as Icons view; rounded + no fill in UI via font-variation-settings.

export const iconCategories: Record<string, string[]> = {
  "All Icons": [],
  Action: [
    "search", "home", "settings", "delete", "info", "check_circle", "favorite",
    "visibility", "bookmark", "lock", "language", "help", "schedule", "fingerprint",
    "trending_up", "history", "done", "power_settings_new", "verified", "zoom_in",
    "zoom_out", "build", "bug_report", "code", "extension", "explore", "lightbulb",
    "receipt", "shopping_cart", "thumb_up", "thumb_down", "star_rate", "token",
    "workspace_premium", "eco", "rocket_launch", "deployed_code", "lab_profile",
  ],
  Alert: [
    "warning", "error", "notification_important", "report", "crisis_alert",
  ],
  AV: [
    "play_arrow", "pause", "stop", "skip_next", "skip_previous", "volume_up",
    "volume_off", "mic", "videocam", "movie", "music_note", "playlist_play",
    "repeat", "shuffle", "speed", "equalizer", "library_music", "podcast",
  ],
  Communication: [
    "mail", "chat", "call", "forum", "contact_mail", "mark_email_read",
    "send", "share", "rss_feed", "hub", "alternate_email", "sms",
    "contacts", "person_add", "group", "campaign", "cell_tower",
  ],
  Content: [
    "add", "remove", "content_copy", "content_paste", "content_cut", "save",
    "undo", "redo", "flag", "link", "push_pin", "filter_list", "sort",
    "archive", "inventory", "draft", "edit_note", "select_all",
  ],
  Device: [
    "smartphone", "laptop", "tablet", "desktop_windows", "watch", "mouse",
    "keyboard", "headphones", "memory", "battery_full", "bluetooth",
    "wifi", "signal_cellular_alt", "gps_fixed", "screen_rotation",
    "dark_mode", "light_mode", "developer_mode", "devices",
  ],
  Editor: [
    "edit", "format_bold", "format_italic", "format_underlined",
    "format_list_bulleted", "format_list_numbered", "format_align_left",
    "format_align_center", "format_align_right", "title", "text_fields",
    "format_color_fill", "format_color_text", "insert_link",
    "insert_photo", "table_chart", "functions", "attach_file",
  ],
  File: [
    "folder", "file_copy", "upload_file", "download", "upload",
    "cloud", "cloud_upload", "cloud_download", "snippet_folder",
    "topic", "drive_file_move", "create_new_folder",
  ],
  Hardware: [
    "computer", "tv", "phone_android", "phone_iphone", "router",
    "scanner", "security", "sim_card", "storage", "usb",
  ],
  Image: [
    "image", "photo_camera", "palette", "brush", "auto_fix_high",
    "filter", "gradient", "tune", "crop", "rotate_right",
    "flip", "blur_on", "hdr_on", "lens", "panorama",
    "photo_library", "slideshow", "camera_alt",
  ],
  Maps: [
    "map", "place", "directions", "navigation", "near_me",
    "local_shipping", "flight", "train", "directions_car",
    "directions_bike", "directions_walk", "traffic", "layers",
    "my_location", "compass_calibration", "restaurant", "local_cafe",
    "local_hospital", "local_parking",
  ],
  Navigation: [
    "menu", "arrow_back", "arrow_forward", "arrow_upward", "arrow_downward",
    "chevron_left", "chevron_right", "expand_more", "expand_less", "close",
    "more_vert", "more_horiz", "refresh", "fullscreen", "fullscreen_exit",
    "apps", "first_page", "last_page", "subdirectory_arrow_right",
  ],
  Notification: [
    "notifications", "notifications_active", "notifications_off",
    "sync", "sync_disabled", "event_available", "priority_high",
    "do_not_disturb", "alarm", "timer",
  ],
  Social: [
    "person", "group", "public", "share", "mood", "sentiment_satisfied",
    "sentiment_dissatisfied", "school", "workspace", "emoji_events",
    "military_tech", "psychology", "diversity_3", "handshake",
  ],
  Toggle: [
    "toggle_on", "toggle_off", "check_box", "check_box_outline_blank",
    "radio_button_checked", "radio_button_unchecked", "star", "star_border",
    "indeterminate_check_box",
  ],
};

iconCategories["All Icons"] = [
  ...new Set(
    Object.entries(iconCategories)
      .filter(([k]) => k !== "All Icons")
      .flatMap(([, v]) => v),
  ),
];

/** Sorted glyph names for selects (same glyphs as Icons view). */
export const allMaterialIconNames = [...iconCategories["All Icons"]].sort((a, b) =>
  a.localeCompare(b),
);

export const categoryNames = Object.keys(iconCategories);
