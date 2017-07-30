export interface HarPage {
  startedDateTime: string;
  /**
   * id of the page, example: 'page_4'
   */
  id: string;
  /**
   * Example: 'http://clients.bannerboy.com/vice/2016-08-10_dory_chatbot/html/disney-pixar_find-dory-chatbot_970x250/'
   */
  title: string;
  pageTimings: any;
}

export interface HarEntry {
  startedDateTime: string;
  time: number;

  /**
   * HTTP Request details
   */
  request: {
    method: string;
    url: string;
    httpVersion: string;
    headers: any[];
    queryString: any[];
    cookies: any[];
    headersSize: number;
    bodySize: number;
  }

  /**
   * HTTP Response details
   */
  response: {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: any[];
    cookies: any[];
    content: {
      size: number;
      mimeType: string;
      compression: number;
      text: string;
      encoding?: string;
    },
    redirectURL: string;
    headersSize: number;
    bodySize: number;
    _transferSize: number;
  }

  cache: any;
  timings: any;
  serverIPAddress: string;
  connection: string;
  /**
   * Id of the page starting the request, example: 'page_4'
   */
  pageref: string;
}

export interface HarData {
  version: string;
  creator: { name: string; version: string; };
  pages: HarPage[];
  entries: HarEntry[];
}
