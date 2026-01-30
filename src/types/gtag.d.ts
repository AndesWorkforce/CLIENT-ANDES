/**
 * Google Tag Manager / Google Analytics Type Declarations
 * Extends the Window interface to include gtag functions
 */

interface Window {
  /**
   * Helper function for delayed navigation with Google Ads conversion tracking
   * @param url - The URL to navigate to after the event is sent
   * @returns false to prevent default link behavior
   */
  gtagSendEvent?: (url: string) => boolean;

  /**
   * Google Analytics gtag function
   */
  gtag?: (...args: any[]) => void;

  /**
   * Google Analytics data layer
   */
  dataLayer?: any[];
}
