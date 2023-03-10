import { posts } from './data';

export type Summary = {
	slug: string;
	title: string;
};

export function load(): { summaries: Summary[] } {
	return {
		summaries: posts.map((post) => {
			return {
				slug: post.slug,
				title: post.title
			};
		})
	};
}
