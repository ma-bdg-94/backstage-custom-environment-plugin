import React, { Fragment, useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  MenuItem,
} from '@material-ui/core';
import { InfoCard, Header, Page, Content } from '@backstage/core-components';
import Select from '@mui/material/Select';
import CheckCircleIcon from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import './environment_comp.css';
import { getScenarioList } from '../../redux/slices/scenario.slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getImageList } from '../../redux/slices/containerImage.slice';
import { createEnvironment } from '../../redux/slices/environment.slice';

export const ExampleComponent = () => {
  const dispatch = useAppDispatch();

  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const scenarioList = useAppSelector(
    (state: any) => state?.scenarios?.scenarioList?.data?.scenarioList,
  );
  const imageList = useAppSelector(
    (state: any) => state?.containerImages?.imageList?.data?.imageList,
  );
  const environmentError = useAppSelector(
    (state: any) => state.environments.error,
  );
  const environmentGitOutputs = useAppSelector(
    (state: any) => state?.environments?.environmentData?.data?.outputs,
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getScenarioList());
    dispatch(getImageList());
  }, []);

  const addMessageWithDelay = (message: string, delay: number) => {
    setTimeout(() => {
      setMessageQueue(prevQueue => [...prevQueue, message]);
    }, delay);
  };

  const setLoadingMessageWithDelay = (message: string, delay: number) => {
    setTimeout(() => {
      setLoadingMessage(message);
    }, delay);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoadingMessage('Loading ...');
      console.log(data);

      // Dispatch the createEnvironment action
      const response = await dispatch(createEnvironment(data));

      // After the action is completed, schedule the display of messages with a delay
      if (response.payload?.data?.outputs) {
        const outputs = response.payload.data.outputs.map(
          (output: any) => output.message,
        );

        let delay = 1000; // Start with 1 second delay for the first message
        for (const message of outputs) {
          addMessageWithDelay(message, delay);
          setLoadingMessage('Loading ...');
          delay += 1000; // Delay for 1 second (1000 milliseconds)
        }
      }

      setLoadingMessage(''); // Clear loading message
    } catch (error: any) {
      console.error('Error creating environment:', error);
      setLoadingMessage(''); // Clear loading message
    }
  };

  return (
    <Page themeId="tool">
      <Header
        style={{ textAlign: 'center', paddingBlock: '3%' }}
        title="Create an on-demand scenario-based environment!"
      />
      <Content>
        <Grid
          container
          spacing={3}
          direction="column"
          style={{ height: '100%' }}
        >
          <Grid item>
            <InfoCard title="Submit Environment Data" className="header">
              <div style={{ display: 'flex' }}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <form
                      className="form-container"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <FormControl className="form-input">
                        <label>Environment Name:</label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="outlined-basic"
                              variant="outlined"
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl className="form-input">
                        <label>Scenario:</label>
                        <Controller
                          name="associatedScenario"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} id="scenario-select">
                              {scenarioList?.map((scenario: any) => (
                                <MenuItem
                                  key={scenario?._id}
                                  value={scenario?._id}
                                >
                                  {scenario?.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                      <FormControl className="form-input">
                        <label>Container Image:</label>
                        <Controller
                          name="associatedContainerImage"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} id="image-select">
                              {imageList?.map((image: any) => (
                                <MenuItem key={image?._id} value={image?._id}>
                                  {`${image?.name}:${image?.tag}`}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        className="submit-button"
                        type="submit"
                      >
                        Submit Data
                      </Button>
                    </form>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{ paddingBlock: '5%', alignItems: 'center' }}
                >
                  {environmentError && (
                    <Typography variant="body1" color="error">
                      {environmentError?.data?.message}
                    </Typography>
                  )}
                  {loadingMessage && <div>{loadingMessage}</div>}
                  {messageQueue.map((message, index) => (
                    <Fragment>
                      <div key={index} className="success-message">
                        ✔ {message}
                      </div>
                     <div>{loadingMessage}</div>
                    </Fragment>
                  ))}
                </Grid>
              </div>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
