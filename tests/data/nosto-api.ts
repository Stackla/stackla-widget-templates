export default `
const apiSetting = {
  server: 'https://connect.staging.nosto.com',
  account: 'shopify-64671154416',
  site: 'http://localhost:4002/development',
  subDomain: '',
  anyDomain: false,
  searchQueryParam: '',
  fullTaggingRequired: false,
  nostoRefParam: 'nosto',
  sourceParameterName: 'nosto_source',
  recoveryPopupEnabled: false,
  trackingTypes: ['api', 'email', 'imgrec', 'cmp'],
  debugRedirectUrl:
    'https://connect.staging.nosto.com/admin/shopify-64671154416/redirect',
  jsErrorUrl: 'https://connect.staging.nosto.com/jserror2',
  discountPopupTriggers: {
    externalCampaign: [
      {
        popup_id: '628b9398d01644085fa01409',
        name: 'Shopper Lands on Page from Source',
        id: 'm6v9xqqqdz',
        enabled: false,
        type: 'externalCampaign',
        condition: {},
      },
    ],
    newCustomer: [
      {
        popup_id: '628b9398d01644085fa0140d',
        name: 'Welcome New Shoppers, Delay by 2 Seconds.',
        effect: {
          scroll_min: 0,
          delay_min: 2000,
          re_entry_tolerance: 0,
        },
        enabled: false,
        type: 'newCustomer',
        condition: {},
      },
    ],
    exitIntent: [
      {
        popup_id: '628b9398d01644085fa0140b',
        name: 'Desktop Shopper Exiting Website with 1+ Item in Shopping Cart.',
        condition: {
          min_cart_size: 1,
          hide_on_desktop: false,
          hide_on_mobile: true,
          advanced: true,
          treat_url_conditions_as_filters: false,
        },
        enabled: false,
        type: 'exitIntent',
      },
    ],
  },
  discountPopupVisible: true,
  extraHosts: [
    'my.stackla.dev',
    'widgets.stackla.dev',
    'my.qa.stackla.com',
    'visual-ugc-staging.myshopify.com/',
  ],
  defaultCurrencyCode: 'EUR',
  placements: {
    IG_Frontpage_Nosto: {
      id: '631adce615aab476a2c8e810',
      enabled: true,
      mode: 'INSERT_AFTER_BEGIN',
      filters: [],
      wrapper: 'SIMPLE',
      cssSelector: '#shopify-section-template--16039364395248__rich_text',
    },
  },
  browserQueueActive: true,
  popupRibbonUrlFilter: false,
  measurePerformance: true,
  stacklaEmbedCodeEndpoint:
    '//widgetapp.teaser.stackla.com/media/js/widget/fluid-embed.js',
  stacklaWidgetAssetPath: '//widgetapp.teaser.stackla.com/',
  stacklaWidgetDomain: 'widgetapp.teaser.stackla.com',
  stacklaTrackingUrl:
    'https://my.teaser.stackla.com/media/js/dist/ugc.bundle.js',
  stacklaDomain: 'https://my.teaser.stackla.com',
  searchEnabled: true,
  searchTemplatesEnabled: true,
  searchTemplateHost:
    'https://d329a44trc3egd.cloudfront.net/shopify-64671154416/search/templates/main',
  searchApiUrl: 'https://search.staging.nosto.com/api/',
};

const products = {
  recommendations: {
    'stacklapopup-product-recommendation': {
      result_id: 'ugc-widget-recommendation-1',
      products: [
        {
          name: 'Nosto Rec: Pure City Vintage Leather Saddle',
          description:
            'This is a demonstration store. You can purchase products like this from Pure Fix Cycles. Theres nothing like the comfort and class of a leather saddle. Whether you’re popping out to the bar or in the middle of a tweed ride, with this saddle youll be floating on a stylish cloud of cow.',
          url: 'http://localhost:4002/development/products/pure-city-vintage-leather-saddle?nosto=ugc-widget-recommendation-1',
          categories: ['Saddle'],
          product_id: '7972151427312',
          price: 90,
          price_currency_code: 'EUR',
          thumb_url:
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Tan_WEB_large.jpg?v=1653377218',
          list_price: 90,
          brand: 'Pure Fix Cycles',
          skus: [
            {
              name: 'Light Honey',
              id: '42871646486768',
              available: true,
              price: 90,
              custom_fields: {
                Color: 'Light Honey',
              },
              image_url:
                'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Tan_WEB_170x170_crop_center.jpg?v=1653377218',
            },
            {
              name: 'Brown',
              id: '42871646519536',
              available: true,
              price: 90,
              custom_fields: {
                Color: 'Brown',
              },
              image_url:
                'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Brown_WEB_170x170_crop_center.jpg?v=1653377218',
            },
            {
              name: 'Black',
              id: '42871646552304',
              available: true,
              price: 90,
              custom_fields: {
                Color: 'Black',
              },
              image_url:
                'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Black_WEB_170x170_crop_center.jpg?v=1653377218',
            },
          ],
          tags1: [
            'Black',
            'Brown',
            'Honey',
            'Leather',
            'Parts',
            'Pure CIty',
            'Saddle',
            'Saddles',
            'Saddles and Seatposts',
            'Things We Love',
          ],
          tags2: [],
          tags3: [],
          price_text: '€90,00',
          custom_fields: {
            productType: 'Saddle',
          },
          date_published: 1653350400000,
          alternate_image_urls: [
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Brown_WEB_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Black_WEB_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCSaddle_TOP_Black_WEB_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCSaddle_TOP_Brown_WEB_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCSaddle_TOP_Tan_WEB_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/Vine_BackSeat_3RD_WEB_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/Clifton_SeatHandles_3RD_WEB_70fb03f1-0c48-496b-98cb-0939239e1790_170x170_crop_center.jpg?v=1653377218',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/Bourbon_1A_3R_3S_WEB_170x170_crop_center.jpg?v=1653377218',
          ],
          image_url:
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Tan_WEB_170x170_crop_center.jpg?v=1653377218',
          list_price_text: '€90,00',
        },
        {
          name: 'Nosto Rec: Contrast Felted Sweater in Black',
          description:
            'A tight rib-knit pullover is made resplendent with a brush of white felted wool embedded firmly in the knit. Gorgeous to behold the Contrast Felted Sweater is exactly the kind of fabrication that Ter et Bantine is known for. Color Black. 100% Virgin Wool. Lana is wearing an Italian 42.',
          url: 'http://localhost:4002/development/products/contrast-felted-sweater-black?nosto=ugc-widget-recommendation-1',
          categories: ["women's knitwear"],
          product_id: '7972181344496',
          price: 698,
          price_currency_code: 'EUR',
          thumb_url:
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_12_large.jpg?v=1653379081',
          list_price: 698,
          brand: 'Ter et Bantine',
          skus: [
            {
              name: 'Black / Italian 42',
              id: '42871780081904',
              available: true,
              price: 698,
              custom_fields: {
                COLOR: 'Black',
                SIZE: 'Italian 42',
              },
            },
            {
              name: 'Black / Italian 44',
              id: '42871780114672',
              available: true,
              price: 698,
              custom_fields: {
                COLOR: 'Black',
                SIZE: 'Italian 44',
              },
            },
            {
              name: 'Black / Italian 46',
              id: '42871780147440',
              available: false,
              price: 698,
              custom_fields: {
                COLOR: 'Black',
                SIZE: 'Italian 46',
              },
            },
          ],
          tags1: [
            'black',
            'contrast',
            'F14',
            'felted',
            'knits',
            'knitwear',
            'Minimalism',
            'SALE',
            'SALE30_4',
            'salefav2',
            'sweater',
            'ter et bantine',
            'visible',
            'white',
            'wool',
          ],
          tags2: [],
          tags3: [],
          price_text: '€698,00',
          custom_fields: {
            'google-custom_product': 'true',
            productType: "women's knitwear",
          },
          date_published: 1653350400000,
          alternate_image_urls: [
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_04_170x170_crop_center.jpg?v=1653379081',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_08_170x170_crop_center.jpg?v=1653379081',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_07_170x170_crop_center.jpg?v=1653379081',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_09_170x170_crop_center.jpg?v=1653379081',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_10_170x170_crop_center.jpg?v=1653379081',
          ],
          image_url:
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_12_170x170_crop_center.jpg?v=1653379081',
          list_price_text: '€698,00',
        },
        {
          name: 'Nosto Rec: Desna Dress',
          description:
            'The Nosto Rec: Desna Dress is an excellent seasonal piece. Layering is optional with its lightweight , barely sheer body-con shape. Skirt reaches knee-length. Sew-in slip. Crew neckline. Color Black. 100% Pima Cotton. Made in the U.S.A.',
          url: 'http://localhost:4002/development/products/desna-dress?nosto=ugc-widget-recommendation-1',
          categories: ["women's dresses"],
          product_id: '7972239900912',
          price: 188,
          price_currency_code: 'EUR',
          thumb_url:
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21844_large.jpg?v=1653382808',
          list_price: 188,
          brand: 'Drifter',
          skus: [
            {
              name: 'Small / Black',
              id: '42871957946608',
              available: false,
              price: 188,
              custom_fields: {
                Size: 'Small',
                Color: 'Black',
              },
            },
            {
              name: 'Medium / Black',
              id: '42871957979376',
              available: true,
              price: 188,
              custom_fields: {
                Size: 'Medium',
                Color: 'Black',
              },
            },
            {
              name: 'Large / Black',
              id: '42871958012144',
              available: true,
              price: 188,
              custom_fields: {
                Size: 'Large',
                Color: 'Black',
              },
            },
          ],
          tags1: [
            'arrivals',
            'AW15',
            'black',
            'Dresses',
            'drifter',
            'Shot 5/14',
            'signature',
            'spring8',
            'Woman',
          ],
          tags2: [],
          tags3: [],
          price_text: '€188,00',
          custom_fields: {
            'google-adwords_grouping': "women's dresses",
            'google-adwords_labels': "women's dresses",
            'google-custom_product': 'true',
            productType: "women's dresses",
          },
          date_published: 1653350400000,
          alternate_image_urls: [
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21850_170x170_crop_center.jpg?v=1653382808',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21851_170x170_crop_center.jpg?v=1653382808',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21854_170x170_crop_center.jpg?v=1653382808',
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21856_170x170_crop_center.jpg?v=1653382808',
          ],
          image_url:
            'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21844_170x170_crop_center.jpg?v=1653382808',
          list_price_text: '€188,00',
        },
      ],
      result_type: 'REAL',
      title: 'Ugc widget cross-sellers',
      div_id: 'ugc-widget-recommendation-1',
      source_product_ids: [],
      params: {
        nosto: 'ugc-widget-recommendation-1',
      },
    },
  },
  campaigns: {
    recommendations: {
      'stacklapopup-product-recommendation': {
        result_id: 'ugc-widget-recommendation-1',
        products: [
          {
            name: 'Nosto Rec: Pure City Vintage Leather Saddle',
            description:
              'This is a demonstration store. You can purchase products like this from Pure Fix Cycles. There’s nothing like the comfort and class of a leather saddle. Whether you’re popping out to the bar or in the middle of a tweed ride, with this saddle youll be floating on a stylish cloud of cow.',
            url: 'http://localhost:4002/development/products/pure-city-vintage-leather-saddle?nosto=ugc-widget-recommendation-1',
            categories: ['Saddle'],
            product_id: '7972151427312',
            price: 90,
            price_currency_code: 'EUR',
            thumb_url:
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Tan_WEB_large.jpg?v=1653377218',
            list_price: 90,
            brand: 'Pure Fix Cycles',
            skus: [
              {
                name: 'Light Honey',
                id: '42871646486768',
                available: true,
                price: 90,
                custom_fields: {
                  Color: 'Light Honey',
                },
                image_url:
                  'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Tan_WEB_170x170_crop_center.jpg?v=1653377218',
              },
              {
                name: 'Brown',
                id: '42871646519536',
                available: true,
                price: 90,
                custom_fields: {
                  Color: 'Brown',
                },
                image_url:
                  'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Brown_WEB_170x170_crop_center.jpg?v=1653377218',
              },
              {
                name: 'Black',
                id: '42871646552304',
                available: true,
                price: 90,
                custom_fields: {
                  Color: 'Black',
                },
                image_url:
                  'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Black_WEB_170x170_crop_center.jpg?v=1653377218',
              },
            ],
            tags1: [
              'Black',
              'Brown',
              'Honey',
              'Leather',
              'Parts',
              'Pure CIty',
              'Saddle',
              'Saddles',
              'Saddles and Seatposts',
              'Things We Love',
            ],
            tags2: [],
            tags3: [],
            price_text: '€90,00',
            custom_fields: {
              productType: 'Saddle',
            },
            date_published: 1653350400000,
            alternate_image_urls: [
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Brown_WEB_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Black_WEB_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCSaddle_TOP_Black_WEB_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCSaddle_TOP_Brown_WEB_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCSaddle_TOP_Tan_WEB_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/Vine_BackSeat_3RD_WEB_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/Clifton_SeatHandles_3RD_WEB_70fb03f1-0c48-496b-98cb-0939239e1790_170x170_crop_center.jpg?v=1653377218',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/Bourbon_1A_3R_3S_WEB_170x170_crop_center.jpg?v=1653377218',
            ],
            image_url:
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/PCLeatherSaddle_3RD_Tan_WEB_170x170_crop_center.jpg?v=1653377218',
            list_price_text: '€90,00',
          },
          {
            name: 'Nosto Rec: Contrast Felted Sweater in Black',
            description:
              'A tight rib-knit pullover is made resplendent with a brush of white felted wool embedded firmly in the knit. Gorgeous to behold the Contrast Felted Sweater is exactly the kind of fabrication that Ter et Bantine is known for. Color Black. 100% Virgin Wool. Lana is wearing an Italian 42.',
            url: 'http://localhost:4002/development/products/contrast-felted-sweater-black?nosto=ugc-widget-recommendation-1',
            categories: ["women's knitwear"],
            product_id: '7972181344496',
            price: 698,
            price_currency_code: 'EUR',
            thumb_url:
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_12_large.jpg?v=1653379081',
            list_price: 698,
            brand: 'Ter et Bantine',
            skus: [
              {
                name: 'Black / Italian 42',
                id: '42871780081904',
                available: true,
                price: 698,
                custom_fields: {
                  COLOR: 'Black',
                  SIZE: 'Italian 42',
                },
              },
              {
                name: 'Black / Italian 44',
                id: '42871780114672',
                available: true,
                price: 698,
                custom_fields: {
                  COLOR: 'Black',
                  SIZE: 'Italian 44',
                },
              },
              {
                name: 'Black / Italian 46',
                id: '42871780147440',
                available: false,
                price: 698,
                custom_fields: {
                  COLOR: 'Black',
                  SIZE: 'Italian 46',
                },
              },
            ],
            tags1: [
              'black',
              'contrast',
              'F14',
              'felted',
              'knits',
              'knitwear',
              'Minimalism',
              'SALE',
              'SALE30_4',
              'salefav2',
              'sweater',
              'ter et bantine',
              'visible',
              'white',
              'wool',
            ],
            tags2: [],
            tags3: [],
            price_text: '€698,00',
            custom_fields: {
              'google-custom_product': 'true',
              productType: "women's knitwear",
            },
            date_published: 1653350400000,
            alternate_image_urls: [
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_04_170x170_crop_center.jpg?v=1653379081',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_08_170x170_crop_center.jpg?v=1653379081',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_07_170x170_crop_center.jpg?v=1653379081',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_09_170x170_crop_center.jpg?v=1653379081',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_10_170x170_crop_center.jpg?v=1653379081',
            ],
            image_url:
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2014_09_27_Lana_Look_11_12_170x170_crop_center.jpg?v=1653379081',
            list_price_text: '€698,00',
          },
          {
            name: 'Nosto Rec: Desna Dress',
            description:
              'The Nosto Rec: Desna Dress is an excellent seasonal piece. Layering is optional with its lightweight , barely sheer body-con shape. Skirt reaches knee-length. Sew-in slip. Crew neckline. Color Black. 100% Pima Cotton. Made in the U.S.A.',
            url: 'http://localhost:4002/development/products/desna-dress?nosto=ugc-widget-recommendation-1',
            categories: ["women's dresses"],
            product_id: '7972239900912',
            price: 188,
            price_currency_code: 'EUR',
            thumb_url:
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21844_large.jpg?v=1653382808',
            list_price: 188,
            brand: 'Drifter',
            skus: [
              {
                name: 'Small / Black',
                id: '42871957946608',
                available: false,
                price: 188,
                custom_fields: {
                  Size: 'Small',
                  Color: 'Black',
                },
              },
              {
                name: 'Medium / Black',
                id: '42871957979376',
                available: true,
                price: 188,
                custom_fields: {
                  Size: 'Medium',
                  Color: 'Black',
                },
              },
              {
                name: 'Large / Black',
                id: '42871958012144',
                available: true,
                price: 188,
                custom_fields: {
                  Size: 'Large',
                  Color: 'Black',
                },
              },
            ],
            tags1: [
              'arrivals',
              'AW15',
              'black',
              'Dresses',
              'drifter',
              'Shot 5/14',
              'signature',
              'spring8',
              'Woman',
            ],
            tags2: [],
            tags3: [],
            price_text: '€188,00',
            custom_fields: {
              'google-adwords_grouping': "women's dresses",
              'google-adwords_labels': "women's dresses",
              'google-custom_product': 'true',
              productType: "women's dresses",
            },
            date_published: 1653350400000,
            alternate_image_urls: [
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21850_170x170_crop_center.jpg?v=1653382808',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21851_170x170_crop_center.jpg?v=1653382808',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21854_170x170_crop_center.jpg?v=1653382808',
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21856_170x170_crop_center.jpg?v=1653382808',
            ],
            image_url:
              'https://cdn.shopify.com/s/files/1/0646/7115/4416/products/2015-05-14_Ashley_Look2_50051_21844_170x170_crop_center.jpg?v=1653382808',
            list_price_text: '€188,00',
          },
        ],
        result_type: 'REAL',
        title: 'Ugc widget cross-sellers',
        div_id: 'ugc-widget-recommendation-1',
        source_product_ids: [],
        params: {
          nosto: 'ugc-widget-recommendation-1',
        },
      },
    },
    content: {},
  },
  page_views: 6,
  geo_location: ['AU', 'NSW', 'Sydney'],
  affinities: {
    top_brands: [],
    top_categories: [],
    top_skus: {},
  },
};

window.nostojs = (apiCallback) => {
  const api = {
    defaultSession: () => ({
      setResponseMode: () => ({
        viewProduct: () => ({
          setPlacements: () => ({
            load: () =>
              new Promise((resolve) => {
                // Simulating data retrieval
                resolve(products);
              }),
          }),
        }),
      }),
    }),
    internal: {
      getSettings: () => apiSetting,
    },
  };

  apiCallback(api);
};
`
