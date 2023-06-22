import { useLazyQuery } from '@apollo/client';
import AverageWaitingTimePerService from '@components/charts/AverageWaitingTimePerService';
import TicketsByServicesChart from '@components/charts/TicketsByServicesChart';
import TicketsPerDayChart from '@components/charts/TicketsPerDayChart';
import DateTimePicker from '@components/utils/DateTimePicker';
import { GET_ALL_TICKETS_BETWEEN_TWO_DATES } from '@graphQL/query/ticketQuery';
import {
  attendanceByService,
  averageWaitingTime,
  averageWaitingTimePerService,
  mostPupularService,
  percentageOfReturnedTickets,
  ticketsPerDay,
  transformDataForExcelDownload,
} from '@utils/statistics/statFunctions';
import { StartEndDate } from '@utils/types/InputTypes';
import { useState } from 'react';
import { utils, writeFileXLSX } from 'xlsx';

function AdminStatistics() {
  const [dateInterval, setDateInterval] = useState<StartEndDate>();
  const [getAllTicketsBetweenTwoDates, { data: ticketList }] = useLazyQuery(
    GET_ALL_TICKETS_BETWEEN_TWO_DATES,
  );

  const validateDateInterval = (dates: StartEndDate) => {
    setDateInterval(dates);
    getAllTicketsBetweenTwoDates({ variables: { data: dates } });
  };

  const downloadExcel = () => {
    const parsedData = transformDataForExcelDownload(ticketList.getAllTicketsBetweenTwoDates);
    const ws = utils.json_to_sheet(parsedData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, 'ticketStatistics.xlsx');
  };

  return (
    <div>
      <div>
        <DateTimePicker validateDateInterval={validateDateInterval} />
        {ticketList ? (
          <div className="flex flex-col">
            <button
              type="button"
              className="f-button-green mt-2 ml-6"
              onClick={downloadExcel}
            >Télécharger les données de la période en format Excel
            </button>
            <div className="f-format-services">
              <div className="bg-amber-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-amber-500">{ticketList && ticketList.getAllTicketsBetweenTwoDates.length}</p>
                <p>Tickets traités</p>
              </div>
              <div className="bg-orange-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-orange-500">{ticketList
                && averageWaitingTime(ticketList.getAllTicketsBetweenTwoDates)} minutes
                </p>
                <p>Temps d'attente moyen</p>
              </div>
              <div className="bg-red-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-red-500">{ticketList && mostPupularService(ticketList.getAllTicketsBetweenTwoDates)}</p>
                <p>Service le plus fréquenté</p>
              </div>
              <div className="bg-lime-100 text-black rounded-2xl p-5">
                <p className="f-bold3xl text-lime-500">{ticketList
                && percentageOfReturnedTickets(ticketList.getAllTicketsBetweenTwoDates)} %
                </p>
                <p>Tickets ajournés</p>
              </div>
            </div>
            <div className="f-format-around-center">
              <div className="flex flex-col">
                <h3 className="ml-4">Nombre de ticket par jour</h3>
                <div className="w-[120%]">
                  <TicketsPerDayChart
                    chartData={
                      ticketsPerDay(dateInterval!, ticketList.getAllTicketsBetweenTwoDates)
                    }
                  />
                </div>
                <h3 className="ml-4 mt-4">Temps d'attente moyen par service en minutes</h3>
                <div>
                  <AverageWaitingTimePerService
                    chartData={
                      averageWaitingTimePerService(ticketList.getAllTicketsBetweenTwoDates)
                    }
                  />
                </div>
              </div>
              <div>
                <h3>Passer la souris sur le diagramme pour en savoir plus</h3>
                <div className="mt-4">
                  <TicketsByServicesChart
                    chartData={attendanceByService(ticketList.getAllTicketsBetweenTwoDates)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : <div className="text-center mt-2 mb-2">Veuillez selectionner la période à afficher</div>}
      </div>
    </div>

  );
}
export default AdminStatistics;
