import {
  Alert, Button, ButtonGroup, Dropdown, ListGroup
} from 'react-bootstrap'
import React from 'react'
import { observer } from 'mobx-react'
import NavigationItem from '../NavigationItem'
import MetadataEditor from '../../MetadataEditor'
import './ProgressView.css'

type ProgressViewProps = {
  router: RouterType
  editor: MetadataEditor
}
type ProgressViewState = {
  status: string
}

class ProgressView extends React.Component<ProgressViewProps, ProgressViewState> {
  constructor(props: ProgressViewProps) {
    super(props)
    this.state = {
      status: null
    }
  }
  saveDraft(navigateNext: boolean) {
    const { editor, router } = this.props
    const { navigate } = router
    const {
      draft
    } = editor
    this.setState({ status: null }, () => {
      editor.saveDraft(draft).then((draft) => {
        editor.draft = draft
        this.setState({ status: 'Draft Saved' })
        if (navigateNext) {
          editor.navigateNext()
          navigate(`/tool_draft/${draft.apiId}/edit/${editor.currentSection.displayName.replace(/\s/g, '_')}`, { replace: false })
        }
      }).catch((error) => {
        this.setState({ status: `Error saving draft! ${error.message}` })
      })
    })
  }

  saveAndPublish() {
    const { editor } = this.props
    const {
      draft
    } = editor
    this.setState({ status: null }, () => {
      editor.saveDraft(draft).then((draft) => {
        editor.draft = draft
        this.setState({ status: 'Draft Saved' })
        editor.publishDraft(draft).then((draft) => {
          editor.draft = draft
        }).catch((error) => {
          this.setState({ status: `Error publishing draft! ${error.message}` })
        })
      }).catch((error) => {
        this.setState({ status: `Error saving draft! ${error.message}` })
      })
    })
  }

  render() {
    const {
      editor, router
    } = this.props
    const { navigate } = router

    const {
      formSections, draft
    } = editor

    const { status } = this.state

    const sectionList = formSections.map((section: FormSection) => (
      <NavigationItem key={JSON.stringify(section)} editor={editor} section={section} />
    ))

    return (
      <>
        <div>
          <Dropdown as={ButtonGroup}>
            <Button
              onClick={() => {
                this.saveDraft(false)
              }}
              variant="success"
            >
              <span data-testid="navigationview--save-draft-button">
                SAVE
              </span>
            </Button>
            <Dropdown.Toggle
              data-testid="navigationview--dropdown-toggle"
              split
              variant="success"
              id="dropdown-split-basic"
            />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                this.saveDraft(true)
              }}
              >
                <span data-testid="navigationview--save-and-continue-button">
                  Save &amp; Continue
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  this.saveAndPublish()
                }}
              >
                Save &amp; Publish

              </Dropdown.Item>
              <Dropdown.Item onClick={() => {
                navigate(`/tool_draft/progress/${draft.apiId}`, { replace: false })
              }}
              >
                <span data-testid="navigationview--save-and-preview">
                  Save &amp; Preview
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          &nbsp;
          <button
            data-testid="navigationview--cancel-button"
            onClick={() => {
              this.setState({ status: null }, () => {
                editor.fetchDraft(draft.apiId).then((draft) => {
                  editor.draft = draft
                  this.setState({ status: 'Changes discarded' })
                }).catch((error) => {
                  this.setState({ status: `Error cancelling. ${error.message}` })
                })
              })
            }}
            type="button"
            className="link-button"
          >
            Cancel
          </button>
          &nbsp;&nbsp;
          {status && (
            <Alert className="alert" key={status} variant="warning">
              {status}
            </Alert>
          )}
        </div>
        <ListGroup className="section-list">
          {sectionList}
        </ListGroup>
      </>
    )
  }
}
export default observer(ProgressView)
