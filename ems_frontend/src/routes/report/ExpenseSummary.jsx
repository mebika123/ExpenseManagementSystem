import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import ReportFilter from '../../components/ui/ReportFilter'
import Report from '../../components/ui/Report'

const ExpenseSummary = () => {
    const [reportData, setReportData] = useState([])
    const [filters, setFilters] = useState(null)

    return (
        <>
            <ReportFilter onReportGenerated={setReportData} setFilters={setFilters} />
            <Report data={reportData} filters={filters} />
        </>
    )
}

export default ExpenseSummary