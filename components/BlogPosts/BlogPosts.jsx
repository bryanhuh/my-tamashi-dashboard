import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import styles from './BlogPosts.module.css';
import blogData from '@/data/blog.json';

export default function BlogPosts() {
  return (
    <div className={styles.container}>
      <div className="sectionIndex">08 — Blog</div>

      <div className={styles.posts}>
        {blogData.map((post, i) => (
          <article key={post.id} className={styles.post} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.postMeta}>
              <span className={styles.postDate}>{post.date}</span>
              <span className={styles.postRead}>
                <Clock size={10} /> {post.readTime}
              </span>
            </div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
            <div className={styles.postFooter}>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
