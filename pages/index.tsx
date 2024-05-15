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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const LeanCanvasGenerator: FC = () => {
  const [title, setTitle] = useState('Lean Canvas');
  const [author, setAuthor] = useState('John Doe');
  const [date, setDate] = useState('2021-09-01');
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
  const [height, setHeight] = useState(600);
  const [fontSize, setFontSize] = useState(16);
  const [textAlignment, setTextAlignment] = useState('left');
  const [sideBar, setSideBar] = useState(true);
  const [padding, setPadding] = useState(8);
  const [useBoxData, setUseBoxData] = useState(false);
  const [fillColor, setFillColor] = useState(false);
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
      if (!node) {
        return;
      }
      let scale = 4;
      domtoimage
        .toPng(node as HTMLElement, {
          width: node.scrollWidth * scale,
          height: node.clientHeight * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
          },
        })
        .then(async function (dataUrl) {
          // convert it to pdf
          const pdfDoc = await PDFDocument.create();
          const pdfImage = await pdfDoc.embedPng(dataUrl);
          const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: pdfImage.width,
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
            writeData(data.problem.replaceAll('\n', '\n\n'), setProblem);
            break;
          case 'solution':
            writeData(data.solution.replaceAll('\n', '\n\n'), setSolution);
            break;
          case 'key_metrics':
            writeData(data.key_metrics.replaceAll('\n', '\n\n'), setKeyMetrics);
            break;
          case 'unique_value_proposition':
            writeData(
              data.unique_value_proposition.replaceAll('\n', '\n\n'),
              setUniqueValueProposition
            );
            break;
          case 'unfair_advantage':
            writeData(
              data.unfair_advantage.replaceAll('\n', '\n\n'),
              setUnfairAdvantage
            );
            break;
          case 'channels':
            writeData(data.channels.replaceAll('\n', '\n\n'), setChannels);
            break;
          case 'customer_segments':
            writeData(
              data.customer_segments.replaceAll('\n', '\n\n'),
              setCustomerSegments
            );
            break;
          case 'cost_structure':
            writeData(
              data.cost_structure.replaceAll('\n', '\n\n'),
              setCostStructure
            );
            break;
          case 'revenue_streams':
            writeData(
              data.revenue_streams.replaceAll('\n', '\n\n'),
              setRevenueStreams
            );
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
  const [smallerRows, setSmallerRows] = useState(5);
  const [largerRows, setLargerRows] = useState(13);
  const getCount = (str: string) => {
    let cnt = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] == '\n') {
        cnt++;
      }
    }
    return cnt;
  };

  const getHeight = (str: string) => {
    let charWidth = 0.55 * fontSize;
    const lines = str.split('\n');
    let numRows = getCount(str) + 1;
    let boxWidth = width / 5 - padding * 2;
    let charPerLine = boxWidth / charWidth;
    lines.forEach((line) => {
      numRows += Math.max(0, Math.ceil(line.length / charPerLine) - 1);
    });
    return numRows;
  };

  const getUpperRows = () => {
    let smallerBoxRows = 5,
      largerBoxRows = 13;
    largerBoxRows = Math.max(largerBoxRows, getHeight(problem));
    smallerBoxRows = Math.max(smallerBoxRows, getHeight(solution));
    smallerBoxRows = Math.max(smallerBoxRows, getHeight(keyMetrics));
    largerBoxRows = Math.max(largerBoxRows, getHeight(uniqueValueProposition));
    smallerBoxRows = Math.max(smallerBoxRows, getHeight(unfairAdvantage));
    smallerBoxRows = Math.max(smallerBoxRows, getHeight(channels));
    largerBoxRows = Math.max(largerBoxRows, getHeight(customerSegments));

    largerBoxRows = Math.max(largerBoxRows, smallerBoxRows * 2 + 3);
    smallerBoxRows = Math.max(smallerBoxRows, (largerBoxRows - 3) / 2);
    console.log('smallerBoxRows', smallerBoxRows);
    console.log('largerBoxRows', largerBoxRows);
    setSmallerRows(smallerBoxRows);
    setLargerRows(largerBoxRows);
  };

  useEffect(() => {
    getUpperRows();
  }, [
    problem,
    solution,
    keyMetrics,
    uniqueValueProposition,
    unfairAdvantage,
    channels,
    customerSegments,
  ]);
  const [hoveredBox, setHoveredBox] = useState('');
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
                      label="Company Description"
                      placeholder="Briefly describe your company and its products or services"
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
                        placeholder="Which industry sector does your company belong to?"
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
                        placeholder="Briefly describe your company and its products or services."
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
                        placeholder="How do your company communicates with your customers? List your Communication Channels."
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
                    Padding Inside Boxes
                  </label>
                  <Slider
                    defaultValue={padding}
                    w={'100%'}
                    min={4}
                    max={16}
                    step={4}
                    label={`${padding}px`}
                    onChange={(value) => setPadding(value)}
                    color="violet"
                    marks={[
                      { value: 4, label: '4px' },
                      { value: 8, label: '8px' },
                      { value: 16, label: '16px' },
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
                  {/* <label
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                    }}
                  >
                    Canvas Height
                  </label>
                  <Slider
                    defaultValue={height}
                    w={'100%'}
                    min={500}
                    max={1000}
                    step={50}
                    label={`${height}px`}
                    onChange={(value) => setHeight(value)}
                    color="violet"
                    marks={[
                      { value: 500, label: '500px' },
                      { value: 700, label: '700px' },
                      { value: 1000, label: '1000px' },
                    ]}
                    mb={16}
                  /> */}
                  <Checkbox
                    label="Fill Color in Boxes"
                    checked={fillColor}
                    onChange={() => setFillColor(!fillColor)}
                    mb={16}
                    color="violet"
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
                      disabled={loading || problem === ''}
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
                  w={width + 48}
                  ref={canvasRef}
                  pos={'relative'}
                  id={'canvas'}
                >
                  <LoadingOverlay
                    visible={loading}
                    loaderProps={{
                      color: 'violet',
                      variant: 'bars',
                    }}
                  />
                  <Text
                    // align="center"
                    weight={700}
                    style={{
                      fontSize: '32px',
                      // padding: '16px',
                    }}
                    mt={24}
                    mx={24}
                  >
                    {title}
                  </Text>
                  <Box
                    mx={{
                      base: 24,
                      md: 24,
                    }}
                    w={'150px'}
                    h={'10px'}
                    bg={'blue'}
                    mb={16}
                  ></Box>
                  <Flex w={width} mx={24} justify={'space-between'} gap={12}>
                    <Flex
                      p={8}
                      align={'center'}
                      gap={8}
                      bg={'#f0f0f0'}
                      style={
                        {
                          // boxShadow: '-2px 0 rgba(0,0,0,0.1)',
                        }
                      }
                      w={'100%'}
                      justify={'center'}
                    >
                      <label>Author:</label>
                      <input
                        value={author}
                        onChange={(event) =>
                          setAuthor(event.currentTarget.value)
                        }
                        placeholder="Author"
                        style={{
                          border: 'none',
                          padding: '8px',
                          fontSize: '16px',
                          width: '200px',
                          textAlign: 'center',
                          backgroundColor: '#f0f0f0',
                        }}
                      />
                    </Flex>
                    <Flex
                      p={8}
                      align={'center'}
                      gap={8}
                      bg={'#f0f0f0'}
                      w={'100%'}
                      justify={'center'}
                    >
                      <label>Date:</label>
                      <input
                        value={date}
                        onChange={(event) => setDate(event.currentTarget.value)}
                        placeholder="Date"
                        style={{
                          border: 'none',
                          padding: '8px',
                          fontSize: '16px',
                          width: '200px',
                          textAlign: 'center',
                          backgroundColor: '#f0f0f0',
                        }}
                      />
                    </Flex>
                  </Flex>
                  <Grid
                    columns={10}
                    mx={24}
                    mt={16}
                    mb={24}
                    w={width}
                    style={{}}
                    // ref={canvasRef}
                  >
                    <HoverCard>
                      <HoverCard.Target>
                        <Grid.Col
                          span={2}
                          p={0}
                          // onMouseEnter={() => setHoveredBox('problem')}
                          // onMouseLeave={() => setHoveredBox('')}
                        >
                          <Flex
                            m={fillColor ? 4 : 0}
                            mt={0}
                            h={'100%'}
                            direction={'column'}
                            bg={
                              fillColor
                                ? '#dd052e'
                                : hoveredBox == 'problem'
                                ? '#f7effe'
                                : 'transparent'
                            }
                            style={{
                              padding: '0px',
                              border: fillColor ? 'none' : '1px solid',
                              ...(fillColor
                                ? {
                                    borderRadius: '20px',
                                  }
                                : {
                                    borderLeft: '2px solid',
                                    borderTop: '2px solid',
                                  }),
                            }}
                          >
                            <Flex
                              justify={'space-between'}
                              gap={4}
                              align={'start'}
                              w={'calc(100%-8px)'}
                              // mx={8}
                              p={padding}
                              mt={4}
                              mx={8}
                              // h={'60px'}
                            >
                              <Text
                                weight={500}
                                my={'auto'}
                                color={fillColor ? 'white' : 'black'}
                                style={{
                                  textDecoration: `underline solid ${
                                    fillColor ? 'white' : '#dd052e'
                                  } 20%`,
                                  textUnderlinePosition: 'under',
                                }}
                              >
                                Problem
                              </Text>
                              <MdReportProblem
                                size={24}
                                color={fillColor ? 'white' : 'black'}
                              />
                            </Flex>
                            <Textarea
                              value={problem}
                              onChange={(event) =>
                                setProblem(event.currentTarget.value)
                              }
                              id="problem"
                              minRows={largerRows}
                              autosize
                              styles={{
                                input: {
                                  border: 'none',
                                  fontSize: fontSize + 'px',
                                  backgroundColor: fillColor
                                    ? '#dd052e'
                                    : 'transparent',
                                  textAlign: textAlignment as
                                    | 'center'
                                    | 'left'
                                    | 'right',
                                  ...(fillColor && {
                                    borderBottomRightRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                    color: 'white',
                                    // fontWeight:'bold'
                                  }),
                                },
                              }}
                            />
                          </Flex>
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
                        ...(!fillColor && {
                          border: '1px solid',
                          borderTop: '2px solid',
                        }),
                      }}
                    >
                      <Grid>
                        <HoverCard>
                          <HoverCard.Target>
                            <Grid.Col
                              span={12}
                              style={{
                                padding: '0px',
                              }}

                              // onMouseEnter={() => setHoveredBox('solution')}
                              // onMouseLeave={() => setHoveredBox('')}
                            >
                              <Flex
                                m={fillColor ? 4 : 0}
                                mt={0}
                                mb={fillColor ? 8 : 0}
                                direction={'column'}
                                bg={
                                  fillColor
                                    ? '#ff9a02'
                                    : hoveredBox == 'solution'
                                    ? '#f7effe'
                                    : 'transparent'
                                }
                                style={{
                                  padding: '0px',
                                  ...(fillColor
                                    ? {
                                        borderRadius: '20px',
                                        border: 'none',
                                      }
                                    : {
                                        borderBottom: '1px solid',
                                      }),
                                }}
                              >
                                <Flex
                                  justify={'space-between'}
                                  gap={4}
                                  align={'start'}
                                  w={'calc(100%-8px)'}
                                  // mx={8}
                                  p={padding}
                                  mt={4}
                                  mx={8}
                                  // h={'60px'}
                                >
                                  <Text
                                    weight={500}
                                    my={'auto'}
                                    color={fillColor ? 'white' : 'black'}
                                    style={{
                                      textDecoration: `underline solid ${
                                        fillColor ? 'white' : '#ff9a02'
                                      } 20%`,
                                      textUnderlinePosition: 'under',
                                    }}
                                  >
                                    Solution
                                  </Text>
                                  <TiLightbulb
                                    size={24}
                                    color={fillColor ? 'white' : 'black'}
                                  />
                                </Flex>

                                <Textarea
                                  value={solution}
                                  onChange={(event) =>
                                    setSolution(event.currentTarget.value)
                                  }
                                  id="solution"
                                  minRows={smallerRows}
                                  autosize
                                  styles={{
                                    input: {
                                      border: 'none',
                                      fontSize: fontSize + 'px',
                                      backgroundColor: fillColor
                                        ? '#ff9a02'
                                        : 'transparent',
                                      textAlign: textAlignment as
                                        | 'center'
                                        | 'left'
                                        | 'right',
                                      ...(fillColor && {
                                        borderBottomRightRadius: '20px',
                                        borderBottomLeftRadius: '20px',
                                        color: 'white',
                                      }),
                                    },
                                  }}
                                />
                              </Flex>
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
                              p={0}

                              // onMouseEnter={() => setHoveredBox('key_metrics')}
                              // onMouseLeave={() => setHoveredBox('')}
                            >
                              <Flex
                                m={fillColor ? 4 : 0}
                                direction={'column'}
                                bg={
                                  fillColor
                                    ? '#fb6b25'
                                    : hoveredBox == 'key_metrics'
                                    ? '#f7effe'
                                    : 'transparent'
                                }
                                style={{
                                  padding: '0px',
                                  ...(fillColor
                                    ? {
                                        borderRadius: '20px',
                                        border: 'none',
                                      }
                                    : {
                                        borderTop: '1px solid',
                                      }),
                                }}
                              >
                                <Flex
                                  justify={'space-between'}
                                  gap={4}
                                  align={'start'}
                                  w={'calc(100%-8px)'}
                                  // mx={8}
                                  p={padding}
                                  mt={4}
                                  mx={8}
                                  // h={'60px'}
                                >
                                  <Text
                                    weight={500}
                                    my={'auto'}
                                    color={fillColor ? 'white' : 'black'}
                                    style={{
                                      textDecoration: `underline solid ${
                                        fillColor ? 'white' : '#fb6b25'
                                      } 20%`,
                                      textUnderlinePosition: 'under',
                                    }}
                                  >
                                    Key Metrics
                                  </Text>
                                  <HiOutlinePresentationChartLine
                                    size={24}
                                    color={fillColor ? 'white' : 'black'}
                                  />
                                </Flex>

                                <Textarea
                                  value={keyMetrics}
                                  onChange={(event) =>
                                    setKeyMetrics(event.currentTarget.value)
                                  }
                                  minRows={smallerRows}
                                  autosize
                                  styles={{
                                    input: {
                                      border: 'none',
                                      fontSize: fontSize + 'px',
                                      backgroundColor: fillColor
                                        ? '#fb6b25'
                                        : 'transparent',
                                      textAlign: textAlignment as
                                        | 'center'
                                        | 'left'
                                        | 'right',
                                      ...(fillColor && {
                                        borderBottomRightRadius: '20px',
                                        borderBottomLeftRadius: '20px',
                                        color: 'white',
                                      }),
                                    },
                                  }}
                                />
                              </Flex>
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
                          p={0}
                          // onMouseEnter={() =>
                          //   setHoveredBox('unique_value_proposition')
                          // }
                          // onMouseLeave={() => setHoveredBox('')}
                        >
                          <Flex
                            m={fillColor ? 4 : 0}
                            mt={0}
                            direction={'column'}
                            style={{
                              border: fillColor ? 'none' : '1px solid',
                              padding: '0px',
                              ...(fillColor
                                ? {
                                    borderRadius: '20px',
                                  }
                                : {
                                    borderTop: '2px solid',
                                  }),
                            }}
                            bg={
                              fillColor
                                ? '#00aa44'
                                : hoveredBox == 'unique_value_proposition'
                                ? '#f7effe'
                                : 'transparent'
                            }
                          >
                            <Flex
                              justify={'space-between'}
                              gap={4}
                              align={'start'}
                              w={'calc(100%-8px)'}
                              // mx={8}
                              p={padding}
                              mt={4}
                              mx={8}
                              // h={'60px'}
                            >
                              <Text
                                weight={500}
                                my={'auto'}
                                color={fillColor ? 'white' : 'black'}
                                style={{
                                  textDecoration: `underline solid ${
                                    fillColor ? 'white' : '#00aa44'
                                  } 20%`,
                                  textUnderlinePosition: 'under',
                                }}
                              >
                                Unique Value Proposition
                              </Text>
                              <AiOutlineGift
                                size={31}
                                color={fillColor ? 'white' : 'black'}
                              />
                            </Flex>

                            <Textarea
                              value={uniqueValueProposition}
                              onChange={(event) =>
                                setUniqueValueProposition(
                                  event.currentTarget.value
                                )
                              }
                              id="uniqueValueProposition"
                              minRows={largerRows}
                              autosize
                              styles={{
                                input: {
                                  border: 'none',
                                  fontSize: fontSize + 'px',
                                  backgroundColor: fillColor
                                    ? '#00aa44'
                                    : 'transparent',
                                  textAlign: textAlignment as
                                    | 'center'
                                    | 'left'
                                    | 'right',
                                  ...(fillColor && {
                                    borderBottomRightRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                    color: 'white',
                                  }),
                                },
                              }}
                            />
                          </Flex>
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
                        ...(!fillColor && {
                          border: '1px solid',
                          borderTop: '2px solid',
                        }),
                      }}
                    >
                      <Grid>
                        <HoverCard>
                          <HoverCard.Target>
                            <Grid.Col
                              span={12}
                              style={{
                                padding: '0px',
                              }}
                              // onMouseEnter={() =>
                              //   setHoveredBox('unfair_advantage')
                              // }
                              // onMouseLeave={() => setHoveredBox('')}
                            >
                              <Flex
                                m={fillColor ? 4 : 0}
                                mt={0}
                                mb={fillColor ? 8 : 0}
                                direction={'column'}
                                style={{
                                  padding: '0px',
                                  ...(fillColor
                                    ? {
                                        borderRadius: '20px',
                                        border: 'none',
                                      }
                                    : {
                                        borderBottom: '1px solid',
                                      }),
                                }}
                                bg={
                                  fillColor
                                    ? '#7fcf2e'
                                    : hoveredBox == 'unfair_advantage'
                                    ? '#f7effe'
                                    : 'transparent'
                                }
                              >
                                <Flex
                                  justify={'space-between'}
                                  gap={4}
                                  align={'start'}
                                  w={'calc(100%-8px)'}
                                  // mx={8}
                                  p={padding}
                                  mt={4}
                                  mx={8}
                                  // h={'60px'}
                                >
                                  <Text
                                    weight={500}
                                    my={'auto'}
                                    color={fillColor ? 'white' : 'black'}
                                    style={{
                                      textDecoration: `underline solid ${
                                        fillColor ? 'white' : '#7fcf2e'
                                      } 20%`,
                                      textUnderlinePosition: 'under',
                                    }}
                                  >
                                    Unfair Advantage
                                  </Text>
                                  <GrAchievement
                                    size={24}
                                    color={fillColor ? 'white' : 'black'}
                                  />
                                </Flex>

                                <Textarea
                                  value={unfairAdvantage}
                                  onChange={(event) =>
                                    setUnfairAdvantage(
                                      event.currentTarget.value
                                    )
                                  }
                                  id="unfairAdvantage"
                                  minRows={smallerRows}
                                  autosize
                                  styles={{
                                    input: {
                                      border: 'none',
                                      fontSize: fontSize + 'px',
                                      backgroundColor: fillColor
                                        ? '#7fcf2e'
                                        : 'transparent',
                                      textAlign: textAlignment as
                                        | 'center'
                                        | 'left'
                                        | 'right',
                                      ...(fillColor && {
                                        borderBottomRightRadius: '20px',
                                        borderBottomLeftRadius: '20px',
                                        color: 'white',
                                      }),
                                    },
                                  }}
                                />
                              </Flex>
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
                              p={0}
                              // onMouseEnter={() => setHoveredBox('channels')}
                              // onMouseLeave={() => setHoveredBox('')}
                            >
                              <Flex
                                m={fillColor ? 4 : 0}
                                direction={'column'}
                                style={{
                                  ...(fillColor
                                    ? {
                                        borderRadius: '20px',
                                        border: 'none',
                                      }
                                    : {
                                        borderTop: '1px solid',
                                      }),
                                  padding: '0px',
                                }}
                                bg={
                                  fillColor
                                    ? '#00b9a9'
                                    : hoveredBox == 'channels'
                                    ? '#f7effe'
                                    : 'transparent'
                                }
                              >
                                <Flex
                                  justify={'space-between'}
                                  gap={4}
                                  align={'start'}
                                  w={'calc(100%-8px)'}
                                  // mx={8}
                                  p={padding}
                                  mt={4}
                                  mx={8}
                                  // h={'60px'}
                                >
                                  <Text
                                    weight={500}
                                    my={'auto'}
                                    color={fillColor ? 'white' : 'black'}
                                    style={{
                                      textDecoration: `underline solid ${
                                        fillColor ? 'white' : '#00b9a9'
                                      } 20%`,
                                      textUnderlinePosition: 'under',
                                    }}
                                  >
                                    Channels
                                  </Text>
                                  <BiNetworkChart
                                    size={24}
                                    color={fillColor ? 'white' : 'black'}
                                  />
                                </Flex>
                                <Textarea
                                  value={channels}
                                  onChange={(event) =>
                                    setChannels(event.currentTarget.value)
                                  }
                                  id="channels"
                                  minRows={smallerRows}
                                  autosize
                                  styles={{
                                    input: {
                                      border: 'none',
                                      fontSize: fontSize + 'px',
                                      backgroundColor: fillColor
                                        ? '#00b9a9'
                                        : 'transparent',
                                      textAlign: textAlignment as
                                        | 'center'
                                        | 'left'
                                        | 'right',
                                      ...(fillColor && {
                                        borderBottomRightRadius: '20px',
                                        borderBottomLeftRadius: '20px',
                                        color: 'white',
                                      }),
                                    },
                                  }}
                                />
                              </Flex>
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
                          p={0}
                          // onMouseEnter={() =>
                          //   setHoveredBox('customer_segments')
                          // }
                          // onMouseLeave={() => setHoveredBox('')}
                        >
                          <Flex
                            m={fillColor ? 4 : 0}
                            mt={0}
                            h={'100%'}
                            direction={'column'}
                            style={{
                              padding: '0px',
                              border: fillColor ? 'none' : '1px solid',
                              ...(fillColor
                                ? {
                                    borderRadius: '20px',
                                  }
                                : {
                                    borderRight: '2px solid',
                                    borderTop: '2px solid',
                                  }),
                            }}
                            bg={
                              fillColor
                                ? '#029fc8'
                                : hoveredBox == 'customer_segments'
                                ? '#f7effe'
                                : 'transparent'
                            }
                          >
                            <Flex
                              justify={'space-between'}
                              gap={4}
                              align={'start'}
                              w={'calc(100%-8px)'}
                              // mx={8}
                              p={padding}
                              mt={4}
                              mx={8}
                              // h={'60px'}
                            >
                              <Text
                                weight={500}
                                my={'auto'}
                                color={fillColor ? 'white' : 'black'}
                                style={{
                                  textDecoration: `underline solid ${
                                    fillColor ? 'white' : '#029fc8'
                                  } 20%`,
                                  textUnderlinePosition: 'under',
                                }}
                              >
                                Customer Segments
                              </Text>
                              <GoPeople
                                size={24}
                                color={fillColor ? 'white' : 'black'}
                              />
                            </Flex>
                            <Textarea
                              value={customerSegments}
                              onChange={(event) =>
                                setCustomerSegments(event.currentTarget.value)
                              }
                              id="customerSegments"
                              minRows={largerRows}
                              autosize
                              styles={{
                                input: {
                                  border: 'none',
                                  fontSize: fontSize + 'px',
                                  backgroundColor: fillColor
                                    ? '#029fc8'
                                    : 'transparent',
                                  textAlign: textAlignment as
                                    | 'center'
                                    | 'left'
                                    | 'right',
                                  ...(fillColor && {
                                    borderBottomRightRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                    color: 'white',
                                  }),
                                },
                              }}
                            />
                          </Flex>
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
                          p={0}
                          // onMouseEnter={() => setHoveredBox('cost_structure')}
                          // onMouseLeave={() => setHoveredBox('')}
                        >
                          <Flex
                            m={fillColor ? 4 : 0}
                            h={'100%'}
                            direction={'column'}
                            style={{
                              border: fillColor ? 'none' : '1px solid',
                              padding: '0px',
                              ...(fillColor
                                ? {
                                    borderRadius: '20px',
                                  }
                                : {
                                    borderLeft: '2px solid',
                                    borderBottom: '2px solid',
                                  }),
                            }}
                            mih={150}
                            bg={
                              fillColor
                                ? '#5d51cf'
                                : hoveredBox == 'cost_structure'
                                ? '#f7effe'
                                : 'transparent'
                            }
                          >
                            <Flex
                              justify={'space-between'}
                              gap={4}
                              align={'start'}
                              w={'calc(100%-8px)'}
                              // mx={8}
                              p={padding}
                              mt={4}
                              mx={8}
                              // h={'60px'}
                            >
                              <Text
                                weight={500}
                                my={'auto'}
                                color={fillColor ? 'white' : 'black'}
                                style={{
                                  textDecoration: `underline solid ${
                                    fillColor ? 'white' : '#5d51cf'
                                  } 20%`,
                                  textUnderlinePosition: 'under',
                                }}
                              >
                                Cost Structure
                              </Text>
                              <LiaFileInvoiceDollarSolid
                                size={24}
                                color={fillColor ? 'white' : 'black'}
                              />
                            </Flex>
                            <Textarea
                              minRows={4}
                              value={costStructure}
                              onChange={(event) =>
                                setCostStructure(event.currentTarget.value)
                              }
                              autosize
                              styles={{
                                input: {
                                  border: 'none',
                                  fontSize: fontSize + 'px',
                                  padding: padding,
                                  textAlign: textAlignment as
                                    | 'center'
                                    | 'left'
                                    | 'right',
                                  backgroundColor: fillColor
                                    ? '#5d51cf'
                                    : 'transparent',
                                  ...(fillColor && {
                                    borderBottomRightRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                    backgroundColor: '#5d51cf',
                                    color: 'white',
                                    //color:'white'
                                  }),
                                },
                              }}
                            />
                          </Flex>
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
                          p={0}
                          // onMouseEnter={() => setHoveredBox('revenue_streams')}
                          // onMouseLeave={() => setHoveredBox('')}
                        >
                          <Flex
                            m={fillColor ? 4 : 0}
                            h={'100%'}
                            direction={'column'}
                            style={{
                              border: fillColor ? 'none' : '1px solid',
                              padding: '0px',
                              ...(fillColor
                                ? {
                                    borderRadius: '20px',
                                  }
                                : {
                                    borderRight: '2px solid',
                                    borderBottom: '2px solid',
                                  }),
                            }}
                            mih={150}
                            bg={
                              fillColor
                                ? '#670fb9'
                                : hoveredBox == 'revenue_streams'
                                ? '#f7effe'
                                : 'transparent'
                            }
                          >
                            <Flex
                              justify={'space-between'}
                              gap={4}
                              align={'start'}
                              w={'calc(100%-8px)'}
                              // mx={8}
                              p={padding}
                              mt={4}
                              mx={8}
                              // h={'60px'}
                            >
                              <Text
                                weight={500}
                                my={'auto'}
                                color={fillColor ? 'white' : 'black'}
                                style={{
                                  textDecoration: `underline solid ${
                                    fillColor ? 'white' : '#670fb9'
                                  } 20%`,
                                  textUnderlinePosition: 'under',
                                }}
                              >
                                Revenue Streams
                              </Text>{' '}
                              <FaMoneyBillTrendUp
                                size={24}
                                color={fillColor ? 'white' : 'black'}
                              />
                            </Flex>
                            <Textarea
                              minRows={4}
                              value={revenueStreams}
                              onChange={(event) =>
                                setRevenueStreams(event.currentTarget.value)
                              }
                              autosize
                              styles={{
                                input: {
                                  border: 'none',
                                  fontSize: fontSize + 'px',
                                  padding: padding,
                                  textAlign: textAlignment as
                                    | 'center'
                                    | 'left'
                                    | 'right',
                                  backgroundColor: fillColor
                                    ? '#670fb9'
                                    : 'transparent',
                                  ...(fillColor && {
                                    borderBottomRightRadius: '20px',
                                    borderBottomLeftRadius: '20px',
                                    backgroundColor: '#670fb9',
                                    color: 'white',
                                    //color:'white'
                                  }),
                                },
                              }}
                            />
                          </Flex>
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
