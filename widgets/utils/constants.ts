/**
 * Common Widget Constants
 * This file contains all static values used in widget utilities as meaningful constant names.
 * Use these constants instead of hardcoded values to improve maintainability and consistency.
 */

// ============================================================================
// Swiper Breakpoints
// ============================================================================

/**
 * Breakpoint for mobile devices (portrait phones)
 */
export const SWIPER_BREAKPOINT_MOBILE = 0

/**
 * Breakpoint for tablet devices (landscape phones, portrait tablets)
 */
export const SWIPER_BREAKPOINT_TABLET = 537

/**
 * Breakpoint for desktop devices (landscape tablets, desktops)
 */
export const SWIPER_BREAKPOINT_DESKTOP = 952

// ============================================================================
// Swiper Slides Per View
// ============================================================================

/**
 * Number of slides visible on mobile devices
 */
export const SWIPER_SLIDES_MOBILE = 1

/**
 * Number of slides visible on tablet devices
 */
export const SWIPER_SLIDES_TABLET = 3

/**
 * Number of slides visible on desktop devices
 */
export const SWIPER_SLIDES_DESKTOP = 7

// ============================================================================
// Swiper Loading State
// ============================================================================

/**
 * Polling interval (in milliseconds) for checking if swiper loading is complete
 */
export const SWIPER_LOADING_CHECK_INTERVAL = 200

/**
 * Initial slide index for swiper
 */
export const SWIPER_INITIAL_SLIDE = 0

// ============================================================================
// Swiper Configuration Defaults
// ============================================================================

/**
 * Default loop setting for swiper
 */
export const SWIPER_DEFAULT_LOOP = false

/**
 * Default grab cursor setting for swiper
 */
export const SWIPER_DEFAULT_GRAB_CURSOR = true

/**
 * Default allow touch move setting for swiper (initially disabled during loading)
 */
export const SWIPER_DEFAULT_ALLOW_TOUCH_MOVE = false

/**
 * Default mousewheel setting for swiper
 */
export const SWIPER_DEFAULT_MOUSEWHEEL = true

/**
 * Default keyboard navigation setting for swiper
 */
export const SWIPER_DEFAULT_KEYBOARD_ENABLED = true

/**
 * Default keyboard only in viewport setting for swiper
 */
export const SWIPER_DEFAULT_KEYBOARD_ONLY_IN_VIEWPORT = false

/**
 * Default slides per view setting for swiper
 */
export const SWIPER_DEFAULT_SLIDES_PER_VIEW = "auto" as const
