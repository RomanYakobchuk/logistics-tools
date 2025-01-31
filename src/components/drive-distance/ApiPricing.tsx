const APIPricing = () => {
    return (
        <div
            className="mt-8 w-full container  lg:max-w-screen-lg bg-white rounded-xl shadow-2xl p-6 border-t-4 border-blue-500">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">API Pricing Comparison</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xl font-bold text-blue-800">Graphhopper</div>
                        <a href="https://www.graphhopper.com/pricing/" target="_blank" rel="noopener noreferrer"
                           className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                            Official Pricing
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path
                                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path
                                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Free:</div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Daily requests:</span>
                                    <span className="font-medium">500</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Limits:</span>
                                    <span className="font-medium">1 vehicle / 5 locations</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">Standard - $69/month</div>
                                <div className="text-sm">5,000/day - 2 vehicles / 30 locations</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">Professional - $199/month</div>
                                <div className="text-sm">15,000/day - 10 vehicles / 80 locations</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">Enterprise - $479/month</div>
                                <div className="text-sm">50,000/day - 20 vehicles / 200 locations</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Additional Info:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>20% discount for annual billing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Custom plan available for higher volumes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xl font-bold text-blue-800">HERE API Route v8</div>
                        <a href="https://www.here.com/get-started/pricing" target="_blank" rel="noopener noreferrer"
                           className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                            Official Pricing
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path
                                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path
                                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Free Plan:</div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Daily limit:</span>
                                    <span className="font-medium">1,000 requests</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Services:</span>
                                    <span className="font-medium">20</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Base Plan (Car):</div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Free monthly:</span>
                                    <span className="font-medium">30,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Over limit price:</span>
                                    <span className="font-medium">$1/1000</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Base Plan (Truck):</div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Free monthly:</span>
                                    <span className="font-medium">5,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Over limit price:</span>
                                    <span className="font-medium">$3/1000</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Additional Info:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Volume discounts available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Custom plan available for enterprise needs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>Price per 1K requests decreases with volume</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Geoapify */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xl font-bold text-blue-800">Geoapify</div>
                        <a href="https://www.geoapify.com/pricing" target="_blank" rel="noopener noreferrer"
                           className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                            Official Pricing
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path
                                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path
                                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Free:</div>
                            <div className="flex justify-between">
                                <span>Daily requests:</span>
                                <span className="font-medium">3,000</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">$59/month</div>
                                <div className="text-sm">10,000 requests/day</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">$109/month</div>
                                <div className="text-sm">25,000 requests/day</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">$179/month</div>
                                <div className="text-sm">50,000 requests/day</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">$299/month</div>
                                <div className="text-sm">100,000 requests/day</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium">$609/month</div>
                                <div className="text-sm">250,000 requests/day</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Additional Info:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>20% discount for annual billing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Custom plans from $860/month</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Google Routes */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-xl font-bold text-blue-800">Google Routes API</div>
                        <a href="https://developers.google.com/maps/documentation/routes/usage-and-billing"
                           target="_blank" rel="noopener noreferrer"
                           className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                            Official Pricing
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path
                                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path
                                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Pricing Tiers:</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>0 - 100,000 requests:</span>
                                    <span className="font-medium">$5/1000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>100,001 - 500,000 requests:</span>
                                    <span className="font-medium">$4/1000</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-semibold mb-2">Features:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Basic routing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span>Real-time traffic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default APIPricing;