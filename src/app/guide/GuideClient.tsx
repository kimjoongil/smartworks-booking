"use client";
import "./../guide.css";
import Image from "next/image";
import React from "react";



const GuideClient = () => {
  return (
    <div className="flex flex-col mt-5 p-4 sm:p-10">
      <h2 className="text-5xl font-bold text-cyan-500 mb-10">
        예약시스템 이용 가이드
      </h2>
      <div className="flex flex-col text-base text-cyan-500 mb-20">
        예약시스템은 웹, 모바일, 태블릿 등 다양한 기기에서 이용 가능합니다.
        <br />
        회의실 예약시 웹, 모바일의 경우 특정날짜 및 시간을 지정하여 예약이
        가능하며 태블릿의 경우 현재 시간을 기준으로만 예약이 가능합니다.
      </div>

      <div id="web" className="flex flex-col">
        <h3 className="text-3xl font-bold text-cyan-500">
          PC,Mobile 이용 GUIDE
        </h3>
        <div className="flex flex-col">
          <div className="flex flex-col py-10">
            <h4 className="text-xl mb-4 text-cyan-500">
              1. 회의실 예약시스템 접속
            </h4>
            <div className="flex flex-col text-sm">
              PC,Mobile 등 모두 접속 가능합니다. http://meet.asone.local 로
              접속하시면 됩니다.
              <br />
              위 주소로 접속이 불가능하신 분은 http://172.16.28.2 로 접속
              하세요.
              <br />
              회의실 예약은 회사 내부망 에서만 접속 가능합니다.
              <br />
              <div className="my-5">
                <p>
                  회의실은 <strong>Hawaii(하와이)</strong>,
                  <strong>Maldives(몰디브)</strong>,{" "}
                  <strong>Mauritius(모리셔스)</strong>,
                  <strong>ShowRoom(쇼룸)</strong>의 4개의 회의실을 이용하실 수
                  있습니다.
                </p>
                <br />

                <ul className="flex flex-col sm:flex-row w-full leading-5 items-center align-middle justify-center">
                  <li className="flex flex-col w-full sm:flex-row">
                    <div className="flex w-full sm:w-1/2">
                      <Image
                        src="/img/guide/guide1.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2 p-4">
                      <h3 className="flex w-full p-2 text-white bg-cyan-500">
                        전체 예약 현황확인
                      </h3>
                      <p className="flex w-full">
                        오늘 날짜를 기준으로 오늘 이후의 예약현황을 보여 줍니다.
                      </p>
                      <ol className="flex flex-col">
                        <li>
                          {" "}
                          1. 현재 시간기준 지난 회의실 현황을 보여 줍니다.
                        </li>
                        <li>
                          {" "}
                          2. 현재 시간기준 현재 이용중인 회의실 현황을 보여
                          줍니다.
                        </li>
                        <li>
                          {" "}
                          3. 오늘날짜의 현재 시간기준 미래 회의실 현황을 보여
                          줍니다.
                        </li>
                      </ol>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col">
          <div className="flex flex-col py-10">
            <h4 className="text-xl mb-4 text-cyan-500">
              2. 회의실 예약/세부현황/예약수정
            </h4>
            <div className="booking flex flex-col text-sm">
              예약을 위해 원하는 회의실을 클릭하여 예약 정보 페이지로
              이동합니다. 예약 정보 페이지에서 예약 정보를 확인할 수 있습니다.
              <br />
              <div className="my-5">
                <p>
                  회의실 세부페이지에서는 <strong>예약현황</strong>,{" "}
                  <strong>예약하기</strong>, <strong>예약수정</strong>이
                  가능합니다.
                </p>
                <br />

                <ul className="flex flex-col sm:flex-row w-full leading-5">
                  <li className="flex flex-col w-full sm:flex-row">
                    <div className="flex w-full sm:w-1/2">
                      <Image
                        src="/img/guide/guide2.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2 p-4">
                      <h3 className="flex w-full p-2 text-white bg-cyan-500">
                        회의실 세부 현황확인
                        <br /> 예약현황, 예약하기, 예약수정이 가능합니다.
                        <br />
                        예약 수정은 예약시 등록한 비밀번호를 입력하셔야 수정이
                        가능합니다.
                      </h3>
                      <p className="flex w-full">
                        오늘 날짜를 기준으로 오늘 이후의 예약현황을 보여 줍니다.
                      </p>
                      <ol className="flex flex-col">
                        <li>
                          {" "}
                          1. 아직 예약이 되지 않은 회의실을 예약할 수 있습니다.
                        </li>
                        <li>
                          {" "}
                          2. 오늘날짜의 현재 시간기준 미래 회의실 현황을 보여
                          주며, 아직 예약이 되지 않은 회의실을 예약할 수
                          있습니다.
                        </li>
                      </ol>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="my-5">
                <h5 className="font-semibold text-lg">2-1. 예약하기</h5>
                <p>
                  - 회의실 예약가능 시간은 오전 8시부터 오후 8시30분까지 예약
                  가능합니다.
                </p>
                <p>
                  - 회의실 예약은 주제, 날짜, 시작시간, 종료시간, 예약자,
                  추가인원, 비밀번호를 입력하셔야 정상등록 됩니다.
                </p>
                <p>
                  - 예약시간은 현재 시간을 기준으로 현재 시간 이 후 부터 예약이
                  가능합니다.
                </p>
                <div className="flex flex-row w-full">
                  <ul className="picture grid grid-cols-1 w-full sm:grid-cols-3 gap-1">
                    <li>
                      <Image
                        src="/img/guide/guide_pop4.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                      <span>그림 A</span>
                    </li>
                    <li>
                      <Image
                        src="/img/guide/guide_pop1.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                      <span>그림 B</span>
                    </li>
                    <li>
                      <Image
                        src="/img/guide/guide_pop2.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                      <span>그림 C</span>
                    </li>
                  </ul>
                </div>
                <p>
                  - 예약날짜의 X 버튼을 클릭하시면 오늘날짜로 자동 세팅됩니다.
                </p>

                <p>
                  - 이미 등록된 날짜와 시간은 예약이 불가능 하며, 날짜선택 후
                  해당날짜의 시간에 예약이 있는 경 우 예약시간은{" "}
                  <strong>회색</strong>으로 표시됩니다.<span>그림 A</span>
                </p>
                <p>
                  - 시간 선택은 30분 단위 이며, <strong>11:00</strong>만 선택 시
                  <strong>11:00~11:30</strong> 까지 <strong>30분</strong>
                  <span>그림 B</span> 이용이 등록되며,{" "}
                  <strong>11:00~11:30</strong> 선택 시 <strong>1시간</strong>
                  <span>그림 C</span> 이용이 등록됩니다.{" "}
                </p>
                <p>
                  - 이용시간을 시작시간이 종료시간보다 이 후 일경우
                  예약시작시간은 종료시간으로, 종료시간은 시작시간으로 자동
                  변경됩니다. 예를 들어 <strong>14:00 ~ 11:30</strong> 선택 시
                  자동으로 <strong>11:30 ~ 14:00</strong> 으로 변경됩니다.
                </p>
                <p>
                  - 비밀번호는 예약정보 수정시 사용 되므로 꼭기억 하셔야 합니다.{" "}
                </p>
              </div>
              <div className="my-5">
                <h5 className="font-semibold text-lg">2-2. 예약수정</h5>
                <p>
                  - 회의실 예약은 회의 주제, 날짜, 시작시간, 종료시간, 예약자,
                  추가인원 정보를 수정 하실 수 있습니다.
                </p>
                <div className="flex flex-row w-full">
                  <ul className="picture grid grid-cols-1 w-full sm:grid-cols-3 gap-1">
                    <li>
                      <Image
                        src="/img/guide/guide_pop3.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border mr-1"
                      />
                      <span>그림 D</span>
                    </li>
                    <li>
                      <Image
                        src="/img/guide/guide_pop5.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border mr-1"
                      />
                      <span>그림 E</span>
                    </li>
                  </ul>
                </div>
                <p>
                  - 예약 수정은 회의 주제, 날짜, 시작시간, 종료시간, 예약자,
                  추가 인원은 예약등록과 동일하며, 예약 등록시 등록한 비밀번호와
                  동일 해야 수정이 가능합니다.
                </p>
                <p>
                  - 예약날짜와 시간변경없이 회의주제, 예약자, 추가인원만 수정시
                  예약정보의 날짜와 시간은 기존에 등록된 날짜,시간으로 유지되며
                  빨간색 라인으로 표시됩니다. <span>그림 D</span>
                </p>
                <p>
                  - 예약날짜와 시간도 새롭게 지정하여 변경 가능힙니다.
                  <span>그림 E</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="flex flex-col">
          <div className="flex flex-col py-10">
            <h4 className="text-xl mb-4 text-cyan-500">
              3. 가입/로그인/로그아웃
            </h4>
            <div className="booking flex flex-col text-sm">
              가입 및 로그인 기능은 직원등록 을 하고 로그인을 하면 회의실 예약내역을 확인 할 수 있고 과거 등록한 예약을 확인 할 수 있습니다.
              
              
              <br />
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div id="tablet" className="flex flex-col mt-10">
        <h3 className="text-3xl font-bold text-cyan-500">Tablet 이용 GUIDE</h3>
        <div className="flex flex-col">
          <div className="flex flex-col py-10">
            <h3 className="text-xl mb-4 text-cyan-500">
              회의실 Tablet 화면은 회의실 별로 5가지의 상태 화면 이 있습니다.
              <br />
              <strong>
                회의실이 비어 있을때, 이용 대기중, 체크인 대기중, 체크인 후 진행
                중, 새로운 회의
              </strong>
              <br />
              회의실의 상태는 실시간으로 반응하며 현재 시간 이후 오늘 일정만
              노출됩니다.
            </h3>
            <div className="flex flex-col text-sm">
              <div className="my-5">
                <ul className="grid grid-cols-2 sm:flex-row w-full leading-5">
                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide1.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>

                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      1. 회의실이 비어 있을때
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - 회의실이 비어 있을때 언제든지 바로 예약이 가능 합니다.
                      </p>
                      <p>
                        - 새로운 회의 클릭시 현재 시간부터 바로 이용 가능합니다.
                      </p>
                    </div>
                  </li>
                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide5.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>
                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      1-1. 새로운 회의
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - <strong>새로운 회의</strong> 예약은 현재 시간부터 바로
                        이용가능하며 10분단위로 이용 하실 수 있습니다.
                      </p>
                      <p>
                        - 다음 일정이 있는경우 다음 회의까지의 시간을 계산하여
                        남은 시간까지 만 예약이 가능합니다.
                      </p>
                    </div>
                  </li>
                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide2.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>
                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      2. 이용 대기 중
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - 현재 이용중인 회의가 없고 다음 회의가 예약 되어 있을때
                        이용 대기중으로 표시됩니다.
                      </p>
                      <p>
                        - <strong>바로체크인</strong>을 선택하면 시작시간이 현재
                        시간으로 변경되며, 바로 이용 가능합니다. 종료 시간은
                        예약시 등록한 종료 시간으로 유지 됩니다.
                      </p>

                      <p>
                        - <strong>새로운 회의</strong>를 선택하면 1-1 과 같이
                        다음 회의시간 전까지 사용등록이 가능합니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide4.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>
                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      2-1. 이용 대기 중 바로 체크인 선택시
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - 이용 대기중 화면에서 바로체크인 버튼을 선택하면 체크인
                        과정없이 현재 시간부터 바로 이용 가능하며, 종료시간은
                        예약시 등록한 종료 시간으로 유지 됩니다. 그만큼
                        사용시간도 늘어나게 됩니다.
                      </p>
                      <p>
                        - 체크인이 완료 되면 <strong>체크아웃</strong>과{" "}
                        <strong>시간연장</strong>이 가능합니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide3.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>

                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      3. 체크인 대기 중
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - 회의실 이용 시작시간이 지난 경우 체크인 대기 상태
                        입니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide4.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>

                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      3-1. 체크인 대기 중 체크인 버튼 선택시
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - 체크인 대기 중 상태에서는 <strong>체크인</strong>을
                        선택하면 체크인 완료 상태로 변경됩니다.
                      </p>
                      <p>
                        - 체크인이 완료 되면 <strong>체크아웃</strong>과{" "}
                        <strong>시간연장</strong>이 가능합니다.
                      </p>
                      <p>- 그림 2-1 과 동일합니다.</p>
                    </div>
                  </li>

                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide4.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>
                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      4. 체크인 후 진행 중
                    </h3>

                    <div className="flex flex-col text-sm">
                      <p>
                        - 체크인 완료 후 진행 중 상태로{" "}
                        <span className="underline">
                          회의가 일찍종료 될 경우 체크아웃을 선택하면, 바로 종료
                          할 수 있으며, 회의가 길어 질때에는 시간연장을 할 수도
                          있습니다.
                        </span>
                        (단, 다음 일정까지 남은 시간까지만 연장 가능합니다.)
                      </p>
                      <p>
                        - <strong>체크아웃</strong>을 선택한경우 바로 종료 되며,
                        일찍 종료되는 시간만큼 다른 사용자가 예약할 수 있습니다.
                      </p>
                      <p>
                        - <strong>시간연장</strong> 버튼은 한번 선택시
                        종료시간에서 <strong>10분씩</strong>추가 됩니다. 예를
                        들어 시간연장 버튼을 천천히 3번 선택하면 30분이
                        연장되며,{" "}
                        <span className="underline">
                          현황판에 시간이 연장되는 것을 확인
                        </span>
                        할 수 있습니다.
                      </p>
                    </div>
                  </li>

                  <li className="flex flex-col w-full pb-10 px-1">
                    <div className="flex w-full">
                      <Image
                        src="/img/guide/tablet_guide5.png"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                        alt={"ASONE"}
                        className="border"
                      />
                    </div>
                    <h3 className="flex justify-center items-center bg-cyan-500 text-white py-2 rounded-md">
                      5. 새로운 회의
                    </h3>
                    <div className="flex flex-col text-sm">
                      <p>
                        - <strong>새로운 회의</strong> 예약은 현재 시간부터 바로
                        이용가능하며 <strong>10분</strong>단위로 이용 하실 수
                        있습니다.
                      </p>
                      <p>
                        - 다음 일정이 있는경우 다음 회의까지의 시간을 계산하여
                        남은 시간까지 만 예약이 가능합니다.
                      </p>
                      <p>
                        - 새로운 회의 바로 등록은{" "}
                        <strong>회의실이 비어 있을때</strong>와{" "}
                        <strong>이용 대기중</strong> 상태에서만 등록이
                        가능합니다.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideClient;
