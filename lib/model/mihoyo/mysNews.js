// src/model/mihoyo/mysNews.ts
const fetchNewsList = async (gid, type, pageSize) => {
	const url = `https://bbs-api-static.miyoushe.com/painter/wapi/getNewsList?gids=${gid}&page_size=${pageSize}&type=${type}`;
	const headers = {
		Referer: "https://www.miyoushe.com",
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	};
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) return [];
		const json = await res.json();
		if (json.retcode !== 0) return [];
		return json.data?.list ?? [];
	} catch {
		return [];
	}
};

export { fetchNewsList };