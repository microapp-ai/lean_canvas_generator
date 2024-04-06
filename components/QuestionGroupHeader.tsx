import { Box, Flex, Switch, Text } from '@mantine/core';
import Image from 'next/image';

type QuestionsGroupHeaderType = {
  title: string;
  subtitle: string;
  icon: string;
  isActived?: boolean;
  onToggle?: () => void;
};

export default function QuestionsGroupHeader({
  title,
  subtitle,
  icon,
  isActived,
  onToggle,
}: QuestionsGroupHeaderType) {
  return (
    <Box
      mb={24}
      display={'flex'}
      sx={() => ({
        justifyContent: 'space-between',
      })}
    >
      <Flex>
        <Image alt="icon" width={29} height={29} src={icon} />
        <Box ml={17}>
          <Text
            color="#202123"
            sx={{ lineHeight: '14.7px' }}
            weight={300}
            size={14}
            mb={4}
          >
            {title}
          </Text>
          <Text
            color="#96979B"
            sx={{ lineHeight: '15px' }}
            weight={300}
            size={12}
          >
            {subtitle}
          </Text>
        </Box>
      </Flex>
      {onToggle && (
        <Flex sx={() => ({ whiteSpace: 'pre' })}>
          <Text color="#202123" size={14} weight={400} mr={8}>
            Advanced Mode
          </Text>
          <Switch
            checked={isActived}
            onChange={onToggle}
            aria-label="Advanced Mode"
            color="violet"
          />
        </Flex>
      )}
    </Box>
  );
}
