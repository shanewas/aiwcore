import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import * as electron from "../../electronScript";
import { connect } from "react-redux";
import {
  UseHeaderAction,
  UnselectHeaderAction,
  SendProcessAction,
  editProcessAction,
  clearFlowchartAction,
  removeStepAction,
  MenualEntryAction,
  iterationChangeAction,
  saveVariables,
  assignVariable,
} from "../../Store/actions";
// import MenualEntryModal from "./MenualEntryModal";
import ProcessConfigModal from "./ProcessConfigModal";
// import BotConfigModal from "./BotConfigModal";
import { ModalContext } from "../../context/ModalContext";

class Flowchart extends Component {
  static contextType = ModalContext;

  state = {
    // BotConfigModalShow: false,
    // menualEntryModalShow: false,
    // menualEntryindex: null,
    ProcessConfigModalShow: false,
    ProcessConfigModalIndex: null,
  };

  // menaulEntry = (index) => {
  //   this.setState({
  //     ...this.state,
  //     menualEntryModalShow: true,
  //     menualEntryindex: index,
  //   });
  // };

  insertHeader = (index) => {
    if (this.props.selectedHeaderIndex !== null) {
      this.props.useHeaders(index);
    } else {
      this.openManualEntryModal(index);
    }
  };

  openVariableModal = () =>
    this.context.setCurrentModal({
      name: "VariableAddModal",
      props: {
        variables: this.props.variables,
        saveVariables: this.props.saveVariables,
        assignVariable: this.props.assignVariable,
      },
    });

  openManualEntryModal = (index) =>
    this.context.setCurrentModal({
      name: "ManualEntryModal",
      props: {
        saveData: (data) => this.props.insertMenualData(data, index),
      },
    });

  openBotConfigModal = () =>
    this.context.setCurrentModal({
      name: "BotConfigModal",
      props: {
        saveIteration: this.saveIteration,
        botIteration: this.props.botIteration,
      },
    });

  removeStep = (index) => {
    this.props.removeStep(index, 1);
  };

  openconfigtab = (index) => {
    this.setState({
      ...this.state,
      ProcessConfigModalShow: true,
      ProcessConfigModalIndex: index,
    });
  };

  openProcessConfigModal = (index) =>
    this.context.setCurrentModal({
      name: "ProcessConfigModal",
      props: {
        editStep: (process) => this.props.editProcess(process, index),
        clearConfig: this.clearConfig,
        currentProcess: this.props.process[index],
        variables: this.props.variables,
      },
    });

  // editStep = (process) => {

  // };

  clearConfig = () => {
    this.setState({
      ...this.state,
      ProcessConfigModalIndex: null,
    });
  };
  saveIteration = (iterationNumber) => {
    this.props.iterationChange(iterationNumber);
  };
  componentDidMount() {
    electron.ipcRenderer.on(electron.ProcessLinkChannel, (e, content) => {
      console.log(content);
      this.props.sendProcess(content);
    });
  }

  componentWillUnmount() {
    electron.ipcRenderer.removeAllListeners(electron.ProcessLinkChannel);
  }

  render() {
    const { setCurrentModal } = this.context;
    if (this.props.process.length === 0) {
      return (
        <div>
          <Card style={{ height: "70vh" }}>
            <span className="float-left">
              Bot Name :
              {this.props.botName ? this.props.botName : " Not Selected"}
            </span>
            <h2 className="text-center" style={{ paddingTop: "20vh" }}>
              {" "}
              No FlowChart has been created
            </h2>
          </Card>
        </div>
      );
    } else {
      return (
        <div>
          {/* <MenualEntryModal
            show={this.state.menualEntryModalShow}
            onHide={() => this.setState({ menualEntryModalShow: false })}
            insertMenualData={this.insertMenualData}
          /> */}
          {/* <BotConfigModal
            show={this.state.BotConfigModalShow}
            onHide={() => this.setState({ BotConfigModalShow: false })}
            saveIteration={this.saveIteration}
            botIteration={this.props.botIteration}
          /> */}
          {/* <ProcessConfigModal
            show={this.state.ProcessConfigModalShow}
            onHide={() => this.setState({ ProcessConfigModalShow: false })}
            editStep={this.editStep}
            clearConfig={this.clearConfig}
            step={this.props.process[this.state.ProcessConfigModalIndex]}
          /> */}
          <Card
            id="scrollstyle"
            style={{ height: "70vh", maxHeight: "70vh", overflowY: "auto" }}
          >
            <span className="float-left">
              Bot Name :
              {this.props.botName ? this.props.botName : " Not Selected"}
            </span>
            <span>
              <i
                className="fas fa-undo-alt float-right mt-3 mr-3 fa-2x"
                onClick={() => {
                  this.props.clearFlowchart();
                }}
              ></i>
              <i
                className="fas fa-cog float-right mt-3 mr-3 fa-2x"
                onClick={this.openBotConfigModal}
              ></i>
              <i
                className="fas fa-file-alt float-right mt-3 mr-3 fa-2x"
                onClick={this.openVariableModal}
              ></i>
            </span>
            {this.props.process.map((step, index) => {
              if (index === 0) {
                return (
                  <div key={index}>
                    <span>
                      <i
                        className="fas fa-window-close float-right mt-5 mr-5"
                        onClick={() => {
                          this.removeStep(index);
                        }}
                      ></i>
                      <i
                        className="fas fa-cog float-right mt-5 mr-2"
                        onClick={() => this.openProcessConfigModal(index)}
                      ></i>
                    </span>
                    <div className=" text-white bg-primary text-center mr-5 ml-5 mb-2 mt-5 p-3">
                      Opened Webpage {step.link ? step.link : "Not selected"}
                    </div>
                  </div>
                );
              } else {
                if (step._type === "click") {
                  return (
                    <div key={index}>
                      <div style={{ textAlign: "center" }}>
                        <i className="fas fa-arrow-down fa-2x"></i>
                      </div>
                      <span>
                        <i
                          className="fas fa-window-close float-right mt-2 mr-5"
                          onClick={() => {
                            this.removeStep(index);
                          }}
                        ></i>
                        <i
                          className="fas fa-cog float-right mt-2 mr-2"
                          onClick={() => {
                            this.openProcessConfigModal(index);
                            // this.openconfigtab(index);
                          }}
                        ></i>
                      </span>
                      <div
                        style={{ backgroundColor: "#eddb66" }}
                        className="m-b-30 text-white bg text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        Clicked on the boutton {step.placeholder}
                      </div>
                    </div>
                  );
                } else if (step._type === "LoadData") {
                  return (
                    <div key={index}>
                      <div style={{ textAlign: "center" }}>
                        <i className="fas fa-arrow-down fa-2x"></i>
                      </div>
                      <span>
                        <i
                          className="fas fa-window-close float-right mt-2 mr-5"
                          onClick={() => {
                            this.removeStep(index);
                          }}
                        ></i>
                        <i
                          className="fas fa-cog float-right mt-2 mr-2"
                          onClick={() => {
                            this.openProcessConfigModal(index);
                            // this.openconfigtab(index);
                          }}
                        ></i>
                        <i
                          className="fas fa-edit float-right mt-2 mr-2"
                          onClick={() =>
                            setCurrentModal({
                              name: "DataConditionsModal",
                              props: {
                                headers: this.props.headers,
                                process: this.props.process[index],
                                editProcess: (process) =>
                                  this.props.editProcess(process, index),
                              },
                            })
                          }
                        ></i>
                      </span>
                      <div
                        style={{ backgroundColor: "#a044b3" }}
                        onClick={() => this.insertHeader(index)}
                        className="m-b-30 text-white bg text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "12px !important",
                            display: "block",
                          }}
                        >
                          {step.conditions?.length ?? 0} Condition(s)
                        </span>
                        Load Data {step.placeholder}
                        <br />
                        {"dataHeader" in step ? (
                          <span
                            style={{ float: "right" }}
                            className="badge badge-lg badge-pill badge-success"
                          >
                            {step.dataHeader}
                          </span>
                        ) : "MenualData" in step ? (
                          <span
                            style={{ float: "right" }}
                            className="badge badge-lg badge-pill badge-warning"
                          >
                            {step.MenualData}
                          </span>
                        ) : (
                          <h6>
                            <span
                              style={{ float: "right" }}
                              className="badge badge-pill badge-danger"
                            >
                              No Data Selected
                            </span>
                          </h6>
                        )}
                      </div>
                    </div>
                  );
                } else if (step._type === "link") {
                  return (
                    <div key={index}>
                      <div style={{ textAlign: "center" }}>
                        <i className="fas fa-arrow-down fa-2x"></i>
                      </div>
                      <span>
                        <i
                          className="fas fa-window-close float-right mt-2 mr-5"
                          onClick={() => {
                            this.removeStep(index);
                          }}
                        ></i>
                        <i
                          className="fas fa-cog float-right mt-2 mr-2"
                          onClick={() => {
                            this.openProcessConfigModal(index);
                            // this.openconfigtab(index);
                          }}
                        ></i>
                      </span>
                      <div className="m-b-30 text-white bg-primary text-center mr-5 ml-5 mb-2 mt-2 p-3">
                        Opened Webpage {step.link}
                      </div>
                    </div>
                  );
                } else if (step._type === "KeyBoard") {
                  return (
                    <div key={index}>
                      <div style={{ textAlign: "center" }}>
                        <i className="fas fa-arrow-down fa-2x"></i>
                      </div>
                      <i
                        className="fas fa-window-close float-right mt-2 mr-5"
                        onClick={() => {
                          this.removeStep(index);
                        }}
                      ></i>
                      <div
                        style={{ backgroundColor: "#fd1b66" }}
                        className="m-b-30 text-white text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        {step.placeholder}
                      </div>
                    </div>
                  );
                } else if (step._type === "ScreenShot") {
                  return (
                    <div key={index}>
                      <div style={{ textAlign: "center" }}>
                        <i className="fas fa-arrow-down fa-2x"></i>
                      </div>
                      <span>
                        <i
                          className="fas fa-window-close float-right mt-2 mr-5"
                          onClick={() => {
                            this.removeStep(index);
                          }}
                        ></i>
                        <i
                          className="fas fa-cog float-right mt-2 mr-2"
                          onClick={() => {
                            this.openProcessConfigModal(index);
                            // this.openconfigtab(index);
                          }}
                        ></i>
                      </span>
                      <div
                        style={{ backgroundColor: "#e4a0f7" }}
                        className="m-b-30 text-white text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        {step.placeholder}
                      </div>
                    </div>
                  );
                } else if (step._type === "Extract Data") {
                  return (
                    <div key={index}>
                      <div style={{ textAlign: "center" }}>
                        <i className="fas fa-arrow-down fa-2x"></i>
                      </div>
                      <span>
                        <i
                          className="fas fa-window-close float-right mt-2 mr-5"
                          onClick={() => {
                            this.removeStep(index);
                          }}
                        ></i>
                        <i
                          className="fas fa-cog float-right mt-2 mr-2"
                          onClick={() => {
                            this.openProcessConfigModal(index);
                            // this.openconfigtab(index);
                          }}
                        ></i>
                      </span>
                      <div
                        style={{ backgroundColor: "#70cee4" }}
                        className="m-b-30 text-white text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        Extracting Data - {step.placeholder}
                      </div>
                    </div>
                  );
                } else {
                  return <div key={index}></div>;
                }
              }
            })}
          </Card>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    process: state.process,
    headers: state.headers,
    selectedHeaderIndex: state.selectedHeader,
    botName: state.botName,
    botIteration: state.botIteration,
    variables: state.variables,
  };
};
const mapDispathtoProps = (dispatch) => {
  return {
    assignVariable: (id, value) => dispatch(assignVariable(id, value)),
    saveVariables: (variables) => dispatch(saveVariables(variables)),
    insertMenualData: (data, processIndex) => {
      dispatch(MenualEntryAction(data, processIndex));
    },
    sendProcess: (process) => {
      dispatch(SendProcessAction(process));
    },
    editProcess: (process, index) => {
      dispatch(editProcessAction(process, index));
    },
    useHeaders: (index) => {
      dispatch(UseHeaderAction(index));
    },
    UnselectHeader: (index) => {
      dispatch(UnselectHeaderAction(index));
    },
    clearFlowchart: () => {
      dispatch(clearFlowchartAction());
    },
    removeStep: (index, num_of_step) => {
      dispatch(removeStepAction(index, num_of_step));
    },
    iterationChange: (iterationNumber) => {
      dispatch(iterationChangeAction(iterationNumber));
    },
  };
};

export default connect(mapStateToProps, mapDispathtoProps)(Flowchart);
