import McqExamCard from "../../molecules/exams/McqExamCard";

export default function McqExamPage({ filteredQues }) {

    return (
        <div className="grid grid-cols-1 gap-5 mt-5">
            {
                filteredQues?.map((que, index) => (
                    <McqExamCard
                        key={que?.id}
                        queIndex={index}
                        question={que}
                    />
                ))
            }
        </div>
    );
}