/**
 * Google Tag Manager / Google Analytics Type Declarations
 * Extends the Window interface to include gtag functions
 */

interface Window {
  /**
   * Helper function for delayed navigation with Google Ads conversion tracking.
   * Fires a conversion event and then navigates to the given URL.
   * @param url - The URL to navigate to after the event is sent
   * @param eventName - Optional custom event name (defaults to 'ads_conversion_Contact_1')
   * @returns false to prevent default link behavior
   */
  gtagSendEvent?: (url: string, eventName?: string) => boolean;

  /**
   * Google Analytics gtag function
   */
  gtag?: (...args: any[]) => void;

  /**
   * Google Analytics data layer
   */
  dataLayer?: any[];
}
