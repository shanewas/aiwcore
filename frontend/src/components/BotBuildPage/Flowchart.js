import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import * as electron from "../../electronScript";
import { connect } from "react-redux";
import shortId from "shortid";
import {
  UseHeaderAction,
  UnselectHeaderAction,
  newProcessAction,
  editProcessAction,
  clearFlowchartAction,
  removeStep as removeStepAction,
  manualDataEntry,
  iterationChangeAction,
  saveVariables,
  editProcessGroup,
  removeFromProcessGroup,
  addToProcessGroup,
} from "../../Store/actions";
import { ModalContext } from "../../context/ModalContext";
import { OpenInNew as OpenIcon } from "@material-ui/icons";
import { GroupWork as GroupWorkIcon } from "@material-ui/icons";
import { Popper } from "@material-ui/core";
import ProcessGroupPopper from "./process/ProcessGroupPopper";

class Flowchart extends Component {
  static contextType = ModalContext;

  state = {
    ProcessConfigModalShow: false,
    ProcessConfigModalIndex: null,
    processEl: null,
    pid: null,
    openPg: false,
  };

  // How to display? naming?
  // multiple groups

  closePopper = () => {
    console.log("close popper");
    this.setState({
      processEl: null,
      openPg: false,
    });
  };

  openProcessGroup = (e, pid) => {
    this.setState({
      processEl: e.currentTarget,
      pid,
      openPg: true,
    });
  };

  // menaulEntry = (index) => {
  //   this.setState({
  //     ...this.state,
  //     menualEntryModalShow: true,
  //     menualEntryindex: index,
  //   });
  // };

  insertHeader = (index, process) => {
    if (this.props.selectedHeaderIndex !== null) {
      this.props.useHeaders(index);
    } else {
      if (process.entryType !== "manual") return;
      this.openManualDataEntryModal(index, process.dataEntry);
    }
  };

  openVariableModal = () =>
    this.context.setCurrentModal({
      name: "VariableAddModal",
      props: {
        variables: this.props.variables,
        saveVariables: this.props.saveVariables,
      },
    });

  openManualDataEntryModal = (index, dataEntry) =>
    this.context.setCurrentModal({
      name: "ManualEntryModal",
      props: {
        dataEntry: dataEntry,
        saveDataEntry: (dataEntry) =>
          this.props.insertMenualData(dataEntry, index),
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
        editStep: (process) => {
          const id = this.props.process[index].id;
          this.props.removeWarningOnProcessUpdate(id);
          this.props.editProcess(process, index);
        },
        currentProcess: this.props.process[index],
        variables: this.props.variables,
        headers: this.props.headers,
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
    // TODO different factory funcs
    electron.ipcRenderer.on(electron.ProcessLinkChannel, (e, content) => {
      const process = { ...content, id: shortId() };
      console.log(process);
      this.props.newProcess(process);
    });
  }

  openLink = (url) => {
    electron.send(electron.SearchLinkChannel, url);
  };

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
          <Card
            id="scrollstyle"
            style={{
              height: "70vh",
              maxHeight: "70vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
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

            <Popper
              open={this.state.openPg}
              anchorEl={this.state.processEl}
              placement="right"
            >
              <ProcessGroupPopper
                addToProcessGroup={this.props.addToProcessGroup}
                removeFromProcessGroup={this.props.removeFromProcessGroup}
                editProcessGroup={this.props.editProcessGroup}
                processGroups={this.props.processGroups}
                fpg={this.props.fpg}
                pid={this.state.pid}
                closePopper={this.closePopper}
              />
            </Popper>

            {this.props.process.map((step, index) => {
              if (index === 0) {
                return (
                  <div
                    key={index}
                    className={
                      this.props.activeWarning === step.id ? "warninghover" : ""
                    }
                  >
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
                      <OpenIcon
                        className="float-right mt-5 mr-2"
                        style={{ color: "#A5A6AD", fontSize: "15px" }}
                        onClick={() => this.openLink(step.link)}
                      />
                    </span>
                    <div className=" text-white bg-primary text-center mr-5 ml-5 mb-2 mt-5 p-3">
                      Opened Webpage {step.link ? step.link : "Not selected"}
                    </div>
                  </div>
                );
              } else {
                if (step._type === "click") {
                  return (
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                        <GroupWorkIcon
                          className="float-right mt-2 mr-2"
                          style={{ color: "#A5A6AD", fontSize: "15px" }}
                          onClick={(e) => this.openProcessGroup(e, step.id)}
                        />
                      </span>
                      <div
                        style={{ backgroundColor: "#a044b3" }}
                        onClick={() => this.insertHeader(index, step)}
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
                        {this.props.fpg[step.id]?.map((group) => (
                          <span
                            style={{ float: "left" }}
                            key={group.id}
                            className={`badge badge-lg badge-pill badge-group badge-${group.color}`}
                          >
                            {group.name}
                          </span>
                        ))}
                        {step.entryType === "dataHeader" && (
                          <span
                            style={{ float: "right" }}
                            className="badge badge-lg badge-pill badge-success"
                          >
                            {step.dataEntry}
                          </span>
                        )}
                        {step.entryType === "manual" && (
                          <span
                            style={{ float: "right" }}
                            className="badge badge-lg badge-pill badge-warning"
                          >
                            {step.dataEntry}
                          </span>
                        )}
                        {step.entryType === "variable" && (
                          <span
                            style={{ float: "right" }}
                            className="badge badge-lg badge-pill badge-warning"
                          >
                            {step.dataEntry}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                } else if (step._type === "link") {
                  return (
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                } else if (step._type === "upload") {
                  return (
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                        style={{
                          backgroundColor: "#363636",
                          border: "1px solid #fff",
                        }}
                        className="m-b-30 text-white text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        Upload Data
                      </div>
                    </div>
                  );
                } else if (step._type === "download") {
                  return (
                    <div
                      key={index}
                      className={
                        this.props.activeWarning === step.id
                          ? "warninghover"
                          : ""
                      }
                    >
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
                        style={{
                          backgroundColor: "#363636",
                          border: "1px solid #fff",
                        }}
                        className="m-b-30 text-white text-center mr-5 ml-5 mb-2 mt-2 p-3"
                      >
                        Download Data
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
    processGroups: state.processGroups,
    headers: state.headers,
    selectedHeaderIndex: state.selectedHeader,
    botName: state.botName,
    botIteration: state.botIteration,
    variables: state.variables,
  };
};
const mapDispathtoProps = (dispatch) => {
  return {
    addToProcessGroup: (ids) => dispatch(addToProcessGroup(ids)),
    removeFromProcessGroup: (ids) => dispatch(removeFromProcessGroup(ids)),
    editProcessGroup: (group) => dispatch(editProcessGroup(group)),
    saveVariables: (variables) => dispatch(saveVariables(variables)),
    insertMenualData: (dataEntry, processIndex) => {
      dispatch(manualDataEntry(dataEntry, processIndex));
    },
    newProcess: (process) => {
      dispatch(newProcessAction(process));
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
