import React, { useState } from 'react';
import styled from 'styled-components';
import UserTagItems from '../../../types/UserTagItems';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TagItem = styled.div<{ selected: boolean }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? '#000' : '#f0f0f0')};
  color: ${(props) => (props.selected ? '#fff' : '#000')};
  margin: 5px;
  cursor: pointer;
`;

interface UserTagSelectionProps {
  onTagsChange: (tags: string[]) => void;
}

const UserTagSelection: React.FC<UserTagSelectionProps> = ({
  onTagsChange,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tag: string) => {
    let newSelectedTags: string[];
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    setSelectedTags(newSelectedTags);
    // Notify parent component
    onTagsChange(newSelectedTags);
  };

  return (
    <TagsContainer>
      {UserTagItems.map((tag, index) => (
        <TagItem
          key={index}
          selected={selectedTags.includes(tag)}
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </TagItem>
      ))}
    </TagsContainer>
  );
};

export default UserTagSelection;
