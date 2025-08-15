declare module "*.scss"
declare module "*.css"

interface Window {
  scrollLocked: boolean
  refreshMasonryLayout: Timeout
  __isLoading: boolean
  StacklaGoConnectConfig: {
    cdn: string,
    domain: string
  }
  ugc: {
    libs: {
      Swiper: swiper
    }
    swiperContainer: Record<string, Swiper>,
    getWidgetBySelector: (selector: string) => {
      sdk: sdk
    }
  },
  stackWidgetDomain: string,
}
