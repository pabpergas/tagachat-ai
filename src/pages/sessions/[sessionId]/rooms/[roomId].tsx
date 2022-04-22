import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  useRadioGroup,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import LoadingSpinner from 'src/components/common/LoadingSpinner'
import { RadioCard } from 'src/components/common/RadioCard'
import useFetch from 'src/hooks/useFetch'
import { tagsFI, tagsDT } from 'src/types/tags.type'
import { tagFIOptions, tagDTOptions } from 'src/utils/tagOptions'

const Message = ({ message }) => {
  const bg = useColorModeValue('gray.50', 'gray.700')

  const { getRootProps: getRootFIProps, getRadioProps: getRadioFIProps } =
    useRadioGroup({
      name: 'tagsFI',
      defaultValue: 'F',
      onChange: handleChange,
    })

  function handleChange(e) {
    console.log(e)
  }

  const { getRootProps: getRootDTProps, getRadioProps: getRadioDTProps } =
    useRadioGroup({
      name: 'tagsDT',
      defaultValue: 'S',
      onChange: handleChange,
    })

  return (
    <Box w="100%" h="auto" padding="10" bg={bg} rounded="10">
      <Flex height="100%" direction="row" align="center" justify="space-around">
        <Text>{message.message}</Text>

        <Stack
          {...getRootFIProps()}
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
        >
          {tagFIOptions.map((value) => (
            <RadioCard key={value} {...getRadioFIProps({ value })}>
              {value}
            </RadioCard>
          ))}
        </Stack>

        <Stack
          {...getRootDTProps()}
          direction={{ base: 'column', lg: 'row' }}
          spacing="0"
        >
          {tagDTOptions.map((value) => (
            <RadioCard key={value} {...getRadioDTProps({ value })}>
              {value}
            </RadioCard>
          ))}
        </Stack>
      </Flex>
    </Box>
  )
}

const Room = () => {
  const router = useRouter()
  const { sessionId, roomId } = router.query

  const [completionRate, setCompletionRate] = useState(0)
  const [changedMessages, setChangedMessages] = useState(0)

  const { data, isLoading, isError } = useFetch(
    `http://localhost:3005/sessions/${sessionId}/rooms?id=${roomId}`
  )

  if (isLoading) return <LoadingSpinner loading={isLoading} />
  if (isError) return <div>failed to load</div>

  return (
    <Box padding="8">
      <Heading>Room: {roomId} - messages</Heading>

      <Heading size="lg">First block</Heading>

      <CircularProgress value={completionRate} color="green.400">
        <CircularProgressLabel>{completionRate}%</CircularProgressLabel>
      </CircularProgress>

      <VStack spacing={30} mt={5}>
        {data[0].first_block.messages.map((message, idx) => (
          <Message key={idx} message={message} />
        ))}
      </VStack>
    </Box>
  )
}

export default Room
