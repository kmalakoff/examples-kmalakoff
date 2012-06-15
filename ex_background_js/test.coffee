root = @

$(document).ready( ->
  module("Background.js")
  test("TEST DEPENDENCY MISSING", ->
    Background.VERSION
  )

  test("Job Queue with 3 arrays with batch size of 3", ->
    stop()

    queue = new Background.JobQueue(10) # create a queue that processes each 10 milliseconds
    iterator = null # declare the iterator here so it is available in the init and run loop 
    test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
    iteration_count = 0; result = 0

    queue.push(
      (->
        # set up the iterator for the arrays in batches of 3
        iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],3)
      ),
      (->
        iteration_count++
        return iterator.nextByItems((items)-> result += items[0]*items[1]*items[2])
      ),
      (->
        #################################
        # Validating the example
        #################################
        expected_iteration_count = Math.ceil((test_array1.length * test_array2.length * test_array3.length) / 3)
        equal(iteration_count, expected_iteration_count, 'expected number of iterations')

        expected_result_1x2 = 3*3 + 3*5 + 7*3 + 7*5 + 11*3 + 11*5
        expected_result = expected_result_1x2*13 + expected_result_1x2*3 + expected_result_1x2*23
        equal(result, expected_result, 'expected result')

        start()
      )
    )
  )


)