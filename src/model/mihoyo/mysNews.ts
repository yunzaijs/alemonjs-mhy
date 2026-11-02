/**
 * 米游社公告 / 资讯
 * 命令: #公告 / #资讯 / #活动 / #原神公告 / #星铁资讯
 */
interface NewsPost {
  post: {
    post_id: string;
    subject: string;
    content: string;
    created_at: number;
  };
}

interface NewsListResponse {
  retcode: number;
  data?: {
    list?: NewsPost[];
  };
}

export const fetchNewsList = async (gid: number, type: number, pageSize: number): Promise<NewsPost[]> => {
  const url = `https://bbs-api-static.miyoushe.com/painter/wapi/getNewsList?gids=${gid}&page_size=${pageSize}&type=${type}`;
  const headers = {
    Referer: 'https://www.miyoushe.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as NewsListResponse;

    if (json.retcode !== 0) {
      return [];
    }

    return json.data?.list ?? [];
  } catch {
    return [];
  }
};
