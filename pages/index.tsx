import {
  Grid,
  Box,
  Flex,
  Text,
  Button,
  Group,
  Stack,
  ScrollArea,
  SegmentedControl,
  Divider,
  Select,
  Textarea,
  Slider,
  RangeSlider,
  LoadingOverlay,
  HoverCard,
} from '@mantine/core';
import React, { FC, useEffect, useState } from 'react';

import { MdReportProblem } from 'react-icons/md';
import { TiLightbulb } from 'react-icons/ti';
import { HiOutlinePresentationChartLine } from 'react-icons/hi';
import { GrAchievement } from 'react-icons/gr';
import { LiaGiftSolid } from 'react-icons/lia';
import { BiNetworkChart } from 'react-icons/bi';
import { AiOutlineGift } from 'react-icons/ai';
import { GoPeople } from 'react-icons/go';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';

import domtoimage from 'dom-to-image';

import {
  Icon123,
  IconAlignLeft,
  IconArrowLeft,
  IconArrowRight,
  IconRefresh,
} from '@tabler/icons-react';

import QuestionsGroupHeader from '@/components/QuestionGroupHeader';
import ComputerIcon from 'public/images/computer.svg';

import { PDFDocument } from 'pdf-lib';

const LeanCanvasGenerator: FC = () => {
  // input fields
  const [companyDescription, setCompanyDescription] = useState('');

  const [minChars, setMinChars] = useState(100);
  const [maxChars, setMaxChars] = useState(500);

  // output fields
  // max 300 characters
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [keyMetrics, setKeyMetrics] = useState('');
  const [uniqueValueProposition, setUniqueValueProposition] = useState('');
  const [unfairAdvantage, setUnfairAdvantage] = useState('');
  const [channels, setChannels] = useState('');
  const [customerSegments, setCustomerSegments] = useState('');
  const [costStructure, setCostStructure] = useState('');
  const [revenueStreams, setRevenueStreams] = useState('');

  // styling parameters
  const [width, setWidth] = useState(1000);
  const [fontSize, setFontSize] = useState(16);
  const [textAlignment, setTextAlignment] = useState('left');
  const [sideBar, setSideBar] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  const writeData = async (
    text: string,
    setterFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const words = text.split(' ');
    let output = '';
    let idx = 0;
    // write word by word with 100ms delay
    const displayText = () => {
      if (idx < words.length) {
        output += words[idx] + ' ';
        setterFunction(output);
        idx++;
        setTimeout(displayText, 50);
      }
    };
    displayText();
  };

  const handleGenerateLeanCanvas = async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        'https://lean-canvas-generator.vercel.app/api/lean_canvas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyDescription,
            minChars,
            maxChars,
          }),
        }
      );
      const data = await resp.json();
      console.log(data);
      writeData(data.problem, setProblem);
      writeData(data.solution, setSolution);
      writeData(data.key_metrics, setKeyMetrics);
      writeData(data.unique_value_proposition, setUniqueValueProposition);
      writeData(data.unfair_advantage, setUnfairAdvantage);
      writeData(data.channels, setChannels);
      writeData(data.customer_segments, setCustomerSegments);
      writeData(data.cost_structure, setCostStructure);
      writeData(data.revenue_streams, setRevenueStreams);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    try {
      var node = document.getElementById('canvas');
      domtoimage
        .toPng(node as HTMLElement, {
          bgcolor: 'white',
        })
        .then(function (dataUrl) {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = 'lean_canvas.png';
          a.click();
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegenerate = (field: string) => {
    setLoading(true);
    try {
      const resp = fetch(
        'https://lean-canvas-generator.vercel.app/api/regenerate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyDescription,
            fieldToBeRegenerated: field,
            previousResponse: {
              problem,
              solution,
              keyMetrics,
              uniqueValueProposition,
              unfairAdvantage,
              channels,
              customerSegments,
              costStructure,
              revenueStreams,
            },
            minChars,
            maxChars,
          }),
        }
      );
      resp.then(async (response) => {
        const data = await response.json();
        switch (field) {
          case 'problem':
            writeData(data.problem, setProblem);
            break;
          case 'solution':
            writeData(data.solution, setSolution);
            break;
          case 'key_metrics':
            writeData(data.key_metrics, setKeyMetrics);
            break;
          case 'unique_value_proposition':
            writeData(data.unique_value_proposition, setUniqueValueProposition);
            break;
          case 'unfair_advantage':
            writeData(data.unfair_advantage, setUnfairAdvantage);
            break;
          case 'channels':
            writeData(data.channels, setChannels);
            break;
          case 'customer_segments':
            writeData(data.customer_segments, setCustomerSegments);
            break;
          case 'cost_structure':
            writeData(data.cost_structure, setCostStructure);
            break;
          case 'revenue_streams':
            writeData(data.revenue_streams, setRevenueStreams);
            break;
          default:
            break;
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Grid h={'100%'} m={0}>
        <Grid.Col
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            backgroundColor: '#FDFDFD',
            borderRight: '1px solid',
            borderColor: '#D9D9D9',
          })}
          sm={12} // On small screens, take the full width
          md={sideBar ? 4 : 0} // On medium screens, take half of the width
        >
          {sideBar && (
            <Box py={24} px={'16px'} w={{ base: '100%' }}>
              <QuestionsGroupHeader
                title={'Lean Canvas Generator'}
                subtitle={'Generate a Lean Canvas for your company'}
                icon={ComputerIcon}
                onToggle={() => setAdvanced(!advanced)}
              />
              <Textarea
                label="Enter a description of your company"
                placeholder="Company Description"
                value={companyDescription}
                onChange={(event) =>
                  setCompanyDescription(event.currentTarget.value)
                }
                minRows={8}
              />
              <Flex my={8} justify={'space-between'} gap={8}>
                <Button
                  color="violet"
                  variant="light"
                  style={{
                    margin: '0 auto',
                    border: '1px solid',
                  }}
                  onClick={handleGenerateLeanCanvas}
                  loading={loading}
                >
                  Generate
                </Button>
                <Button
                  color="green"
                  variant="light"
                  style={{
                    margin: '0 auto',
                    border: '1px solid',
                  }}
                  onClick={handleDownload}
                  disabled={
                    problem === '' ||
                    solution === '' ||
                    keyMetrics === '' ||
                    uniqueValueProposition === '' ||
                    unfairAdvantage === '' ||
                    channels === '' ||
                    customerSegments === '' ||
                    costStructure === '' ||
                    revenueStreams === '' ||
                    loading
                  }
                >
                  Download as PDF
                </Button>
              </Flex>
              {advanced && (
                <Flex
                  my={16}
                  justify={'space-between'}
                  direction={'column'}
                  mx={8}
                >
                  <Divider my={16} />
                  <Text
                    style={{
                      fontSize: '24px',
                      fontWeight: 500,
                      marginBottom: '16px',
                    }}
                  >
                    Advanced Options
                  </Text>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                    }}
                  >
                    Character Limits for Each Field
                  </label>
                  <RangeSlider
                    defaultValue={[minChars, maxChars]}
                    min={0}
                    max={1000}
                    step={100}
                    label={(value) => `${value} characters`}
                    onChange={(value) => {
                      setMinChars(value[0]);
                      setMaxChars(value[1]);
                    }}
                    color="violet"
                    marks={[
                      { value: 0, label: '0' },
                      { value: 500, label: '500' },
                      { value: 1000, label: '1000' },
                    ]}
                    mb={20}
                  />

                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                    }}
                  >
                    Font Size
                  </label>
                  <Slider
                    defaultValue={fontSize}
                    w={'100%'}
                    min={12}
                    max={24}
                    step={2}
                    label={`${fontSize}px`}
                    onChange={(value) => setFontSize(value)}
                    color="violet"
                    marks={[
                      { value: 12, label: '12px' },
                      { value: 16, label: '16px' },
                      { value: 24, label: '24px' },
                    ]}
                    mb={20}
                  />

                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                    }}
                  >
                    Text Alignment
                  </label>
                  <SegmentedControl
                    fullWidth
                    color="violet"
                    value={textAlignment}
                    onChange={setTextAlignment}
                    data={[
                      { value: 'left', label: 'Left' },
                      { value: 'center', label: 'Center' },
                      { value: 'right', label: 'Right' },
                    ]}
                    mb={20}
                  />

                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                    }}
                  >
                    Canvas Width
                  </label>
                  <Slider
                    defaultValue={width}
                    w={'100%'}
                    min={700}
                    max={2100}
                    step={100}
                    label={`${width}px`}
                    onChange={(value) => setWidth(value)}
                    color="violet"
                    marks={[
                      { value: 700, label: '700px' },
                      { value: 1200, label: '1200px' },
                      { value: 1500, label: '1500px' },
                      { value: 2100, label: '2000px' },
                    ]}
                    mb={16}
                  />
                </Flex>
              )}
            </Box>
          )}
        </Grid.Col>
        <Grid.Col
          sm={12}
          md={sideBar ? 8 : 12}
          style={{
            overflow: 'auto',
          }}
        >
          <Box
            w={'100%'}
            // ref={canvasRef}
          >
            <Flex
              align={'center'}
              style={{
                width: '100%',
              }}
            >
              <div
                onClick={() => setSideBar(!sideBar)}
                style={{
                  cursor: 'pointer',
                  height: '100px',
                  width: '20px',
                  backgroundColor: '#a0aaff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '0px 10px 10px 0px',
                }}
              >
                {sideBar ? (
                  <IconArrowLeft size={24} color="#ffffff" />
                ) : (
                  <IconArrowRight size={24} color="#ffffff" />
                )}
              </div>
              <Box
                style={{
                  width: 'calc(100% - 20px)',
                  // overflow: 'auto',
                }}
                ref={canvasRef}
                pos={'relative'}
                id={'canvas'}
              >
                <LoadingOverlay visible={loading} />
                <Grid
                  columns={10}
                  mx={24}
                  my={24}
                  w={width}
                  style={{
                    border: '2px solid',
                  }}
                  // ref={canvasRef}
                >
                  <HoverCard>
                    <HoverCard.Target>
                      <Grid.Col
                        span={2}
                        mih={400}
                        style={{
                          padding: '0px',
                          borderRight: '1px solid',
                        }}
                      >
                        <Flex
                          justify={'start'}
                          gap={4}
                          align={'center'}
                          w={'100%'}
                          mx={4}
                          mt={4}
                          h={'60px'}
                        >
                          <MdReportProblem size={20} />
                          <Text align="center" weight={500} my={'auto'}>
                            Problem
                          </Text>
                        </Flex>
                        <textarea
                          value={problem}
                          onChange={(event) =>
                            setProblem(event.currentTarget.value)
                          }
                          style={{
                            width: '100%',
                            height: 'calc(100% - 64px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: 'none',
                            padding: '10px',
                            fontSize: fontSize + 'px',
                            resize: 'vertical',
                            textAlign: textAlignment as
                              | 'center'
                              | 'left'
                              | 'right',
                          }}
                        />
                      </Grid.Col>
                    </HoverCard.Target>
                    {problem.length > 0 && (
                      <HoverCard.Dropdown>
                        <Button
                          onClick={() => {
                            handleRegenerate('problem');
                          }}
                          color="green"
                          variant="light"
                          leftIcon={<IconRefresh />}
                          style={{
                            width: '100%',
                            border: '1px solid',
                          }}
                          loading={loading}
                        >
                          Regenerate This Field
                        </Button>
                      </HoverCard.Dropdown>
                    )}
                  </HoverCard>
                  <Grid.Col
                    span={2}
                    style={{
                      borderRight: '1px solid',
                    }}
                  >
                    <Grid>
                      <HoverCard>
                        <HoverCard.Target>
                          <Grid.Col
                            span={12}
                            mih={200}
                            style={{
                              padding: '0px',
                            }}
                          >
                            <Flex
                              justify={'start'}
                              gap={4}
                              align={'center'}
                              w={'100%'}
                              mx={4}
                              mt={4}
                              h={'60px'}
                            >
                              <TiLightbulb size={24} />
                              <Text align="center" weight={500} my={'auto'}>
                                Solution
                              </Text>
                            </Flex>
                            <textarea
                              value={solution}
                              onChange={(event) =>
                                setSolution(event.currentTarget.value)
                              }
                              style={{
                                width: '100%',
                                height: 'calc(100% - 64px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                padding: '10px',
                                resize: 'vertical',
                                fontSize: fontSize + 'px',
                                textAlign: textAlignment as
                                  | 'center'
                                  | 'left'
                                  | 'right',
                              }}
                            />
                          </Grid.Col>
                        </HoverCard.Target>
                        {solution.length > 0 && (
                          <HoverCard.Dropdown>
                            <Button
                              onClick={() => {
                                handleRegenerate('solution');
                              }}
                              color="green"
                              variant="light"
                              leftIcon={<IconRefresh />}
                              style={{
                                width: '100%',
                                border: '1px solid',
                              }}
                              loading={loading}
                            >
                              Regenerate This Field
                            </Button>
                          </HoverCard.Dropdown>
                        )}
                      </HoverCard>
                      <HoverCard>
                        <HoverCard.Target>
                          <Grid.Col
                            span={12}
                            mih={200}
                            style={{
                              padding: '0px',
                              borderTop: '1px solid',
                            }}
                          >
                            <Flex
                              justify={'start'}
                              gap={4}
                              align={'center'}
                              w={'100%'}
                              mx={4}
                              mt={4}
                              h={'60px'}
                            >
                              <HiOutlinePresentationChartLine size={24} />
                              <Text align="center" weight={500} my={'auto'}>
                                Key Metrics
                              </Text>
                            </Flex>
                            <textarea
                              value={keyMetrics}
                              onChange={(event) =>
                                setKeyMetrics(event.currentTarget.value)
                              }
                              style={{
                                width: '100%',
                                height: 'calc(100% - 64px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                padding: '10px',
                                fontSize: fontSize + 'px',
                                resize: 'vertical',
                                textAlign: textAlignment as
                                  | 'center'
                                  | 'left'
                                  | 'right',
                              }}
                            />
                          </Grid.Col>
                        </HoverCard.Target>
                        {keyMetrics.length > 0 && (
                          <HoverCard.Dropdown>
                            <Button
                              onClick={() => {
                                handleRegenerate('key_metrics');
                              }}
                              color="green"
                              variant="light"
                              leftIcon={<IconRefresh />}
                              style={{
                                width: '100%',
                                border: '1px solid',
                              }}
                              loading={loading}
                            >
                              Regenerate This Field
                            </Button>
                          </HoverCard.Dropdown>
                        )}
                      </HoverCard>
                    </Grid>
                  </Grid.Col>
                  <HoverCard>
                    <HoverCard.Target>
                      <Grid.Col
                        span={2}
                        style={{
                          borderRight: '1px solid',
                          padding: '0px',
                        }}
                      >
                        <Flex
                          justify={'start'}
                          gap={4}
                          align={'center'}
                          w={'100%'}
                          mx={4}
                          mt={4}
                          h={'60px'}
                        >
                          <AiOutlineGift size={24} />
                          <Text align="center" weight={500} my={'auto'}>
                            Unique Value Proposition
                          </Text>
                        </Flex>
                        <textarea
                          value={uniqueValueProposition}
                          onChange={(event) =>
                            setUniqueValueProposition(event.currentTarget.value)
                          }
                          style={{
                            width: '100%',
                            height: 'calc(100% - 64px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: 'none',
                            padding: '10px',
                            fontSize: fontSize + 'px',
                            resize: 'vertical',
                            textAlign: textAlignment as
                              | 'center'
                              | 'left'
                              | 'right',
                          }}
                        />
                      </Grid.Col>
                    </HoverCard.Target>
                    {uniqueValueProposition.length > 0 && (
                      <HoverCard.Dropdown>
                        <Button
                          onClick={() => {
                            handleRegenerate('unique_value_proposition');
                          }}
                          color="green"
                          variant="light"
                          leftIcon={<IconRefresh />}
                          style={{
                            width: '100%',
                            border: '1px solid',
                          }}
                          loading={loading}
                        >
                          Regenerate This Field
                        </Button>
                      </HoverCard.Dropdown>
                    )}
                  </HoverCard>
                  <Grid.Col
                    span={2}
                    style={{
                      borderRight: '1px solid',
                    }}
                  >
                    <Grid>
                      <HoverCard>
                        <HoverCard.Target>
                          <Grid.Col
                            span={12}
                            mih={200}
                            style={{
                              padding: '0px',
                            }}
                          >
                            <Flex
                              justify={'start'}
                              gap={4}
                              align={'center'}
                              w={'100%'}
                              mx={4}
                              mt={4}
                              h={'60px'}
                            >
                              <GrAchievement size={24} />
                              <Text align="center" weight={500} my={'auto'}>
                                Unfair Advantage
                              </Text>
                            </Flex>
                            <textarea
                              value={unfairAdvantage}
                              onChange={(event) =>
                                setUnfairAdvantage(event.currentTarget.value)
                              }
                              style={{
                                width: '100%',
                                height: 'calc(100% - 64px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                padding: '10px',
                                fontSize: fontSize + 'px',
                                resize: 'vertical',
                                textAlign: textAlignment as
                                  | 'center'
                                  | 'left'
                                  | 'right',
                              }}
                            />
                          </Grid.Col>
                        </HoverCard.Target>
                        {unfairAdvantage.length > 0 && (
                          <HoverCard.Dropdown>
                            <Button
                              onClick={() => {
                                handleRegenerate('unfair_advantage');
                              }}
                              color="green"
                              variant="light"
                              leftIcon={<IconRefresh />}
                              style={{
                                width: '100%',
                                border: '1px solid',
                              }}
                              loading={loading}
                            >
                              Regenerate This Field
                            </Button>
                          </HoverCard.Dropdown>
                        )}
                      </HoverCard>
                      <HoverCard>
                        <HoverCard.Target>
                          <Grid.Col
                            span={12}
                            mih={200}
                            style={{
                              borderTop: '1px solid',
                              padding: '0px',
                            }}
                          >
                            <Flex
                              justify={'start'}
                              gap={4}
                              align={'center'}
                              w={'100%'}
                              mx={4}
                              mt={4}
                              h={'60px'}
                            >
                              <BiNetworkChart size={24} />
                              <Text align="center" weight={500} my={'auto'}>
                                Channels
                              </Text>
                            </Flex>
                            <textarea
                              value={channels}
                              onChange={(event) =>
                                setChannels(event.currentTarget.value)
                              }
                              style={{
                                width: '100%',
                                height: 'calc(100% - 64px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                padding: '10px',
                                fontSize: fontSize + 'px',
                                resize: 'vertical',
                                textAlign: textAlignment as
                                  | 'center'
                                  | 'left'
                                  | 'right',
                              }}
                            />
                          </Grid.Col>
                        </HoverCard.Target>
                        {channels.length > 0 && (
                          <HoverCard.Dropdown>
                            <Button
                              onClick={() => {
                                handleRegenerate('channels');
                              }}
                              color="green"
                              variant="light"
                              leftIcon={<IconRefresh />}
                              style={{
                                width: '100%',
                                border: '1px solid',
                              }}
                              loading={loading}
                            >
                              Regenerate This Field
                            </Button>
                          </HoverCard.Dropdown>
                        )}
                      </HoverCard>
                    </Grid>
                  </Grid.Col>
                  <HoverCard>
                    <HoverCard.Target>
                      <Grid.Col
                        span={2}
                        style={{
                          padding: '0px',
                        }}
                      >
                        <Flex
                          justify={'start'}
                          gap={4}
                          align={'center'}
                          w={'100%'}
                          mx={4}
                          mt={4}
                          h={'60px'}
                        >
                          <GoPeople size={24} />
                          <Text align="center" weight={500} my={'auto'}>
                            Customer Segments
                          </Text>
                        </Flex>
                        <textarea
                          value={customerSegments}
                          onChange={(event) =>
                            setCustomerSegments(event.currentTarget.value)
                          }
                          style={{
                            width: '100%',
                            height: 'calc(100% - 64px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: 'none',
                            padding: '10px',
                            fontSize: fontSize + 'px',
                            resize: 'vertical',
                            textAlign: textAlignment as
                              | 'center'
                              | 'left'
                              | 'right',
                          }}
                        />
                      </Grid.Col>
                    </HoverCard.Target>
                    {customerSegments.length > 0 && (
                      <HoverCard.Dropdown>
                        <Button
                          onClick={() => {
                            handleRegenerate('customer_segments');
                          }}
                          color="green"
                          variant="light"
                          leftIcon={<IconRefresh />}
                          style={{
                            width: '100%',
                            border: '1px solid',
                          }}
                          loading={loading}
                        >
                          Regenerate This Field
                        </Button>
                      </HoverCard.Dropdown>
                    )}
                  </HoverCard>
                  <HoverCard>
                    <HoverCard.Target>
                      <Grid.Col
                        span={5}
                        style={{
                          borderRight: '1px solid',
                          borderTop: '1px solid',
                          padding: '0px',
                        }}
                        mih={200}
                      >
                        <Flex
                          justify={'start'}
                          gap={4}
                          align={'center'}
                          w={'100%'}
                          mx={4}
                          mt={4}
                          h={'60px'}
                        >
                          <LiaFileInvoiceDollarSolid size={24} />
                          <Text align="center" weight={500} my={'auto'}>
                            Cost Structure
                          </Text>
                        </Flex>
                        <textarea
                          value={costStructure}
                          onChange={(event) =>
                            setCostStructure(event.currentTarget.value)
                          }
                          style={{
                            width: '100%',
                            height: 'calc(100% - 64px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: 'none',
                            padding: '10px',
                            fontSize: fontSize + 'px',
                            resize: 'vertical',
                            textAlign: textAlignment as
                              | 'center'
                              | 'left'
                              | 'right',
                          }}
                        />
                      </Grid.Col>
                    </HoverCard.Target>
                    {costStructure.length > 0 && (
                      <HoverCard.Dropdown>
                        <Button
                          onClick={() => {
                            handleRegenerate('cost_structure');
                          }}
                          color="green"
                          variant="light"
                          leftIcon={<IconRefresh />}
                          style={{
                            width: '100%',
                            border: '1px solid',
                          }}
                          loading={loading}
                        >
                          Regenerate This Field
                        </Button>
                      </HoverCard.Dropdown>
                    )}
                  </HoverCard>
                  <HoverCard>
                    <HoverCard.Target>
                      <Grid.Col
                        span={5}
                        style={{
                          borderTop: '1px solid',
                          padding: '0px',
                        }}
                      >
                        <Flex
                          justify={'start'}
                          gap={4}
                          align={'center'}
                          w={'100%'}
                          mx={4}
                          mt={4}
                          h={'60px'}
                        >
                          <FaMoneyBillTrendUp size={24} />
                          <Text align="center" weight={500} my={'auto'}>
                            Revenue Streams
                          </Text>
                        </Flex>
                        <textarea
                          value={revenueStreams}
                          onChange={(event) =>
                            setRevenueStreams(event.currentTarget.value)
                          }
                          style={{
                            width: '100%',
                            height: 'calc(100% - 64px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: 'none',
                            padding: '10px',
                            fontSize: fontSize + 'px',
                            resize: 'vertical',
                            textAlign: textAlignment as
                              | 'center'
                              | 'left'
                              | 'right',
                          }}
                        />
                      </Grid.Col>
                    </HoverCard.Target>
                    {revenueStreams.length > 0 && (
                      <HoverCard.Dropdown>
                        <Button
                          onClick={() => {
                            handleRegenerate('revenue_streams');
                          }}
                          color="green"
                          variant="light"
                          leftIcon={<IconRefresh />}
                          style={{
                            width: '100%',
                            border: '1px solid',
                          }}
                          loading={loading}
                        >
                          Regenerate This Field
                        </Button>
                      </HoverCard.Dropdown>
                    )}
                  </HoverCard>
                </Grid>
              </Box>
            </Flex>
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default LeanCanvasGenerator;
