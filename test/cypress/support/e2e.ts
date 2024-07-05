
/* global chai */
// because this file is imported from cypress/support/e2e.js
// that means all other spec files will have this assertion plugin
// available to them because the supportFile is bundled and served
// prior to any spec files loading

import PartialBlockMutationEvent from '../fixtures/types/PartialBlockMutationEvent';

/**
 * Chai plugin for checking if passed onChange method is called with an array of passed events
 *
 * @param _chai - Chai instance
 */
const beCalledWithBatchedEvents = (_chai): void => {
  /**
   * Check if passed onChange method is called with an array of passed events
   *
   * @param expectedEvents - batched events to check
   */
  function assertToBeCalledWithBatchedEvents(expectedEvents: PartialBlockMutationEvent[]): void {
    /**
     * EditorJS API is passed as the first parameter of the onChange callback
     */
    const EditorJSApiMock = Cypress.sinon.match.any;
    const $onChange = this._obj;

    this.assert(
      $onChange.calledOnce,
      'expected #{this} to be called once',
      'expected #{this} to not be called once'
    );

    this.assert(
      $onChange.calledWithMatch(
        EditorJSApiMock,
        Cypress.sinon.match((events: PartialBlockMutationEvent[]) => {
          expect(events).to.be.an('array');

          return events.every((event, index) => {
            const eventToCheck = expectedEvents[index];

            return expect(event).to.containSubset(eventToCheck);
          });
        })
      ),
      'expected #{this} to be called with #{exp}, but it was called with #{act}',
      'expected #{this} to not be called with #{exp}, but it was called with #{act} ',
      expectedEvents
    );
  }

  _chai.Assertion.addMethod('calledWithBatchedEvents', assertToBeCalledWithBatchedEvents);
};

/**
 * registers our assertion function "beCalledWithBatchedEvents" with Chai
 */
chai.use(beCalledWithBatchedEvents);
