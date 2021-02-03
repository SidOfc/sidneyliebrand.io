import styles from './tag.module.scss';
import Tag from './tag';

export default function Container({tags, className, ...props}) {
    return (
        <div {...props} className={`${styles.container} ${className}`}>
            {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
            ))}
        </div>
    );
}
