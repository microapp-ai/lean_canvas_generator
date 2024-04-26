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
  TextInput,
  Autocomplete,
  Radio,
  Drawer,
  Checkbox,
} from '@mantine/core';
import React, { FC, useEffect, useState } from 'react';
import classes from 'styles/index.module.css';
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
  // input fields advanced =  (Industry, Company Description, Problem, Advantage, Communication channels (optional can  be filled by AI)
  const [companyDescription, setCompanyDescription] = useState('');
  // const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  // const [prodOrService, setProdOrService] = useState('product');
  // const [prodOrServiceDesc, setProdOrServiceDesc] = useState('');
  const [problems, setProblems] = useState('');
  // const [targetMarket, setTargetMarket] = useState('');
  const [advantage, setAdvantage] = useState('');
  const [communicationChannels, setCommunicationChannels] = useState('');
  // const [existingAlternatives, setExistingAlternatives] = useState('');

  const [minChars, setMinChars] = useState(200);
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
  const [useBoxData, setUseBoxData] = useState(false);
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
            companyDescription: !advanced
              ? JSON.stringify({
                  companyDescription,
                  ...(useBoxData && {
                    problem,
                    solution,
                    keyMetrics,
                    uniqueValueProposition,
                    unfairAdvantage,
                    channels,
                    customerSegments,
                    costStructure,
                    revenueStreams,
                  }),
                })
              : JSON.stringify({
                  industry,
                  companyDescription,
                  problems,
                  advantage,
                  // add optional fields if they are not empty
                  ...(communicationChannels
                    ? { communicationChannels }
                    : {
                        communicationChannels:
                          'Please assume the communication channels as per requirement and other fields as well.',
                      }),
                  ...(useBoxData && {
                    problem,
                    solution,
                    keyMetrics,
                    uniqueValueProposition,
                    unfairAdvantage,
                    channels,
                    customerSegments,
                    costStructure,
                    revenueStreams,
                  }),
                }),
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
        .then(async function (dataUrl) {
          // convert it to pdf
          const pdfDoc = await PDFDocument.create();
          const pdfImage = await pdfDoc.embedPng(dataUrl);
          const page = pdfDoc.addPage([width, pdfImage.height]);
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: width,
          });
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'lean_canvas.pdf';
          link.click();
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
            companyDescription: !advanced
              ? companyDescription
              : JSON.stringify({
                  industry,
                  problems,
                  advantage,
                  companyDescription,
                  // add optional fields if they are not empty
                  ...(communicationChannels
                    ? { communicationChannels }
                    : {
                        communicationChannels:
                          'Please assume the communication channels as per requirement and other fields as well.',
                      }),
                }),
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
  const [advancedStyling, setAdvancedStyling] = useState(false);
  const listOfIndustries = [
    'Agriculture',
    'Automotive',
    'Banking',
    'Construction',
    'Education',
    'Energy',
    'Entertainment',
    'Fashion',
    'Finance',
    'Food',
    'Healthcare',
    'Hospitality',
    'Insurance',
    'Manufacturing',
    'Media',
    'Real Estate',
    'Retail',
    'Technology',
    'Telecommunications',
    'Transportation',
    'Travel',
    'Utilities',
  ];
  const [valid, setValid] = useState(false);
  const checkRequiredFields = () => {
    if (advanced) {
      return (
        // console.log('companyName', companyName),
        console.log('industry', industry),
        // console.log('prodOrService', prodOrService),
        // console.log('prodOrServiceDesc', prodOrServiceDesc),
        console.log('problems', problems),
        // console.log('targetMarket', targetMarket),
        // console.log('existingAlternatives', existingAlternatives),
        companyDescription === ''
        // targetMarket === '' ||
        // existingAlternatives === ''
      );
    } else {
      return companyDescription === '';
    }
  };
  useEffect(() => {
    setValid(!checkRequiredFields());
  }, [
    industry,
    problems,
    advantage,
    companyDescription,
    advanced,
    companyDescription,
  ]);

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
          md={sideBar ? 12 : 12} // On medium screens, take half of the width
          m={0}
        >
          <Grid w={'100%'} m={0} p={0}>
            <Grid.Col sm={12} md={7}>
              {
                // sideBar &&
                <Box
                  py={24}
                  px={'16px'}
                  w={{ base: '100%' }}
                  mx={'auto'}
                  maw={{
                    md: '700px',
                  }}
                >
                  <QuestionsGroupHeader
                    title={'Lean Canvas Generator'}
                    subtitle={'Generate a Lean Canvas for your company'}
                    icon={ComputerIcon}
                    onToggle={() => setAdvanced(!advanced)}
                  />
                  {!advanced && (
                    <Textarea
                      label="Enter a description of your company"
                      placeholder="Company Description"
                      value={companyDescription}
                      onChange={(event) =>
                        setCompanyDescription(event.currentTarget.value)
                      }
                      minRows={4}
                      required
                      classNames={{
                        required: classes.required,
                      }}
                    />
                  )}
                  {advanced && (
                    <Flex direction={'column'} gap={8} my={8}>
                      {/* <TextInput
                        label="Company Name (Optional)"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(event) =>
                          setCompanyName(event.currentTarget.value)
                        }
                      /> */}
                      <Autocomplete
                        label="Industry"
                        placeholder="Industry"
                        data={listOfIndustries}
                        value={industry}
                        // required
                        classNames={{
                          required: classes.required,
                        }}
                        onChange={(value) => setIndustry(value)}
                      />
                      {/* <Text
                        style={{
                          fontSize: '16px',
                          fontWeight: 400,
                        }}
                      >
                        Is your company product or service based?
                        <span
                          style={{
                            color: 'red',
                            fontSize: '16px',
                            fontWeight: 600,
                          }}
                        >
                          {` * `}
                        </span>
                      </Text>
                      <Radio.Group
                        value={prodOrService}
                        onChange={(value) => setProdOrService(value)}
                      >
                        <Radio
                          value={'product'}
                          checked={prodOrService === 'product'}
                          onClick={() => {
                            setProdOrService('product');
                          }}
                          label="Product based"
                          m={8}
                          color="violet"
                        />
                        <Radio
                          value={'service'}
                          checked={prodOrService === 'service'}
                          onClick={() => {
                            setProdOrService('service');
                          }}
                          label="Service based"
                          m={8}
                          color="violet"
                        />
                      </Radio.Group> */}
                      {/* <Textarea
                        label="Product or Service Description"
                        placeholder="Briefly describe your product or service. What problem does it solve?"
                        value={prodOrServiceDesc}
                        onChange={(event) =>
                          setProdOrServiceDesc(event.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                        required
                        classNames={{
                          required: classes.required,
                        }}
                      /> */}
                      <Textarea
                        label="Company Description"
                        placeholder="Briefly describe your company, its products, or services. (Required)"
                        value={companyDescription}
                        onChange={(event) =>
                          setCompanyDescription(event.currentTarget.value)
                        }
                        minRows={3}
                        autosize
                        required
                        classNames={{
                          required: classes.required,
                        }}
                      />
                      <Textarea
                        label="Problems"
                        placeholder="Describe the existing problems in the market that your company seeks to solve."
                        value={problems}
                        onChange={(event) =>
                          setProblems(event.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                        // required
                        classNames={{
                          required: classes.required,
                        }}
                      />
                      <Textarea
                        label="Advantage"
                        placeholder="Does your company have any exclusivity, something that only it will do/possess in the market? If yes, what?"
                        value={advantage}
                        onChange={(event) =>
                          setAdvantage(event.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                        // required
                        classNames={{
                          required: classes.required,
                        }}
                      />
                      {/* <Textarea
                        label="Target Market"
                        placeholder="Who is your target market? Describe your ideal customer."
                        value={targetMarket}
                        onChange={(event) =>
                          setTargetMarket(event.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                        required
                        classNames={{
                          required: classes.required,
                        }}
                      /> */}

                      {/* <Textarea
                        label="Existing Alternatives"
                        placeholder="What are the existing alternatives to your product or service? Briefly describe them."
                        value={existingAlternatives}
                        onChange={(event) =>
                          setExistingAlternatives(event.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                        required
                        classNames={{
                          required: classes.required,
                        }}
                      /> */}
                      <Textarea
                        label="Communication Channels (Optional)"
                        placeholder="How do you communicate with your customers? List your communication channels."
                        value={communicationChannels}
                        onChange={(event) =>
                          setCommunicationChannels(event.currentTarget.value)
                        }
                        minRows={2}
                        autosize
                      />
                    </Flex>
                  )}
                </Box>
              }
            </Grid.Col>
            <Grid.Col sm={12} md={5}>
              <Box
                py={24}
                w={{ base: '100%' }}
                maw={{ md: '500px' }}
                mx={'auto'}
              >
                <Flex
                  // w={'95%'}
                  my={16}
                  // justify={'space-between'}
                  direction={'column'}
                  mx={24}
                  gap={12}
                >
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
                    w={'100%'}
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
                    size="sm"
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
                    max={1500}
                    step={100}
                    label={`${width}px`}
                    onChange={(value) => setWidth(value)}
                    color="violet"
                    marks={[
                      { value: 700, label: '700px' },
                      { value: 1000, label: '1000px' },
                      { value: 1500, label: '1500px' },
                    ]}
                    mb={16}
                  />
                  <Checkbox
                    label="Use Data in Boxes as Inputs"
                    checked={useBoxData}
                    onChange={() => setUseBoxData(!useBoxData)}
                    mb={16}
                    mt={12}
                    color="violet"
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
                      disabled={!valid}
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
                </Flex>
              </Box>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col sm={12} md={12}>
          <Flex justify={'flex-end'}>
            {/* <Button
              onClick={() => setAdvancedStyling(true)}
              color="violet"
              variant="light"
              style={{
                margin: '16px',
                border: '1px solid',
              }}
            >
              Show advanced styling options
            </Button> */}
          </Flex>
          <Flex justify={'center'}>
            {/* <div
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
                margin: 'auto 0',
              }}
            >
              {sideBar ? (
                <IconArrowLeft size={24} color="#ffffff" />
              ) : (
                <IconArrowRight size={24} color="#ffffff" />
              )}
            </div> */}
            <Box
              // w={'100%'}
              // ref={canvasRef}
              style={{
                overflow: 'auto',
              }}
            >
              <Flex
                align={'center'}
                style={{
                  width: '100%',
                }}
              >
                <Box
                  style={{
                    width: 'calc(100% - 20px)',
                    // overflow: 'auto',
                  }}
                  ref={canvasRef}
                  pos={'relative'}
                  id={'canvas'}
                >
                  <LoadingOverlay visible={loading} color="violet" />
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
                              setUniqueValueProposition(
                                event.currentTarget.value
                              )
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
          </Flex>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default LeanCanvasGenerator;
