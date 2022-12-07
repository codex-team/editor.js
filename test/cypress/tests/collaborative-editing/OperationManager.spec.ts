describe('Operation Manager', () => {
  /**
   * Mock Private EventBus
   *
   *
   */
  describe('Local changes', () => {
    it('should put new operation to the end of Pending OPs queue', () => {
      console.log('todo');
    });

    it('should send first operation from the Pending OPs queue to the Server', () => {
      console.log('todo');
    });

    it('should remove operation from the start of Pending OPs queue after Acknowledgement from the Server', () => {
      console.log('todo');
    });

    it('should not send new operation to the Server if it\'s waiting for Acknowledgement from the Server', () => {
      console.log('todo');
    });

    it('should receive Acknowledgement from the Server and put Operations from response to the Resolved OPs', () => {
      console.log('todo');
    });
  });

  describe('Received changes', () => {
    it('should execute Transformer over Pending OPs relative to the received operation and put them back to the Pending OPs', () => {
      console.log('todo');
      // Think about how to check changes in the Pending OPs
    });

    it('should put received operation to the end of Resolved OPs', () => {
      console.log('todo');
    });

    it('should emit an OperationReceived event with received operation to the Private EventBus', () => {
      console.log('todo');
    });
  });

  describe('Document Revision', () => {
    it('should send current Document Revision with a new Operation', () => {
      console.log('todo');
    });

    it('should set current Document Revision from received Operation', () => {
      console.log('todo');
    });
  });
});
